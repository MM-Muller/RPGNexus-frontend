import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject, takeUntil, map, of } from 'rxjs';
import { BattleConfigService } from 'src/app/core/services/battle-config.service';
import { CharacterService } from 'src/app/core/services/character.service';
import { CampaignService } from 'src/app/core/services/campaign.service';
import { Battle, DialogLine, Enemy } from 'src/app/models/battle.model';
import { Character } from 'src/app/models/character.model';
import { CampaignEvent } from 'src/app/models/campaign.model';
import { BattleState } from 'src/app/models/battle-state.model';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatLogContainer') private chatLogContainer!: ElementRef;

  battleConfig?: Battle;
  enemy?: Enemy;
  playerCharacter?: Character;

  playerHealth: number = 0;
  playerMaxHealth: number = 0;
  enemyHealth: number = 0;
  enemyMaxHealth: number = 0;

  isLoadingAction = false;
  isPlayerTurn: boolean = false;
  isBattleOver = false;
  battleResult = '';
  isTyping: boolean = false;
  isContentLoading = true;

  dialogHistory: DialogLine[] = [];
  selectedAction: string = '';
  actionSuggestions: string[] = [];
  isActionPanelVisible = false;

  private battleState: BattleState | null = null;
  private destroy$ = new Subject<void>();
  
  private interval: any;
  private shouldScrollToBottom = false;
  timeLeft: number = 300;
  timerDisplay: string = '5:00';
  private animationFrameId: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private battleConfigService: BattleConfigService,
    private characterService: CharacterService,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    const battleId = this.route.snapshot.paramMap.get('id');
    const characterId = this.route.snapshot.paramMap.get('characterId');
    if (characterId) {
      this.loadCharacterData(characterId, battleId);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.animationFrameId) {
        clearTimeout(this.animationFrameId);
    }
    this.saveBattleState();
    this.campaignService.disconnect();
  }

  loadCharacterData(characterId: string, battleIdFromRoute: string | null): void {
    const battleId = battleIdFromRoute || 'primordial-nebula';

    forkJoin({
      character: this.characterService.getCharacters().pipe(
        map((characters: Character[]) => characters.find((c: Character) => c.id === characterId))
      ),
      battle: this.battleConfigService.getBattle(battleId)
    }).subscribe(({ character, battle }) => {
      if (!character) {
        console.error('Personagem não encontrado. Redirecionando...');
        this.navigateToWorlds(characterId);
        return;
      }
      if (!battle) {
        console.error('Dados de batalha não encontrados. Redirecionando...');
        this.navigateToWorlds(characterId);
        return;
      }

      this.playerCharacter = character;
      this.battleConfig = battle;
      this.enemy = { ...battle.enemy };
      this.setupPlayerStats();

      this.campaignService.connect(character.id, battleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(message => {
          if (this.isContentLoading) {
            this.isContentLoading = false;
          }
          
          switch (message.type) {
            case 'load_state':
              this.loadBattleState(message.payload);
              break;
            case 'narrative_start':
              this.isLoadingAction = true;
              this.isTyping = true;
              this.dialogHistory = [];
              break;
            case 'narrative_chunk':
              this.addDialogEntry('Narrador', message.payload);
              break;
            case 'narrative_end':
              this.processEvent(message.payload.event);
              this.isLoadingAction = false;
              this.isTyping = false;
              if (!this.isBattleOver) {
                this.isPlayerTurn = true;
                this.startTimer();
              }
              break;
            case 'suggestions':
              this.actionSuggestions = message.payload.suggestions;
              break;
            case 'battle_over':
              this.endBattle(message.payload.victory);
              break;
            default:
              console.warn('Tipo de mensagem desconhecida:', message.type);
              break;
          }
        });
    });
  }

  setupPlayerStats(): void {
    if (!this.playerCharacter || !this.battleConfig) return;
    this.playerMaxHealth = 200;
    this.playerHealth = 200;

    this.enemyMaxHealth = this.battleConfig.enemy.maxHealth;
    this.enemyHealth = this.battleConfig.enemy.health;
  }
  
  sendPlayerAction(): void {
    if (!this.playerCharacter || !this.battleConfig || this.selectedAction.trim() === '' || !this.isPlayerTurn || this.isBattleOver) return;
    
    this.isLoadingAction = true;
    this.isPlayerTurn = false;
    this.isTyping = true;
    clearInterval(this.interval);

    const playerAction = this.selectedAction;
    this.addDialogEntry(this.playerCharacter.name, playerAction);
    this.selectedAction = '';
    this.forceScrollToBottom();
    
    this.campaignService.sendMessage('player_action', {
      action: playerAction,
      history: this.dialogHistory.map(d => `${d.speaker}: ${d.text}`)
    });
  }

  fetchActionSuggestions(): void {
    if (!this.playerCharacter || !this.battleConfig || this.isLoadingAction) return;

    this.isLoadingAction = true;
    const historyTexts = this.dialogHistory.map(d => `${d.speaker}: ${d.text}`);
    this.campaignService.getActionSuggestions(this.playerCharacter.id, this.battleConfig.theme, historyTexts)
      .subscribe(response => {
        this.actionSuggestions = response.suggestions;
        this.isActionPanelVisible = true;
        this.isLoadingAction = false;
      });
  }

  processEvent(event: CampaignEvent): void {
    if (!event) return;

    if (event.danoRecebido && this.playerCharacter) {
      this.playerHealth = Math.max(0, this.playerHealth - event.danoRecebido);
    }
    if (event.danoCausado && this.enemy) {
      this.enemyHealth = Math.max(0, this.enemyHealth - event.danoCausado);
    }

    if (event.vitoria || this.playerHealth <= 0 || (this.enemy && this.enemyHealth <= 0)) {
      this.endBattle(event.vitoria);
    }
  }

  endBattle(playerWon?: boolean): void {
    this.isBattleOver = true;
    this.isPlayerTurn = false;
    clearInterval(this.interval);

    if (playerWon || (this.enemy && this.enemyHealth <= 0)) {
      this.battleResult = 'VITÓRIA!';
      this.addDialogEntry('Sistema', 'Você venceu a batalha e ganhou experiência!');
      if (this.playerCharacter && this.battleConfig) {
        this.characterService.getCharacterProgress(this.playerCharacter.id).subscribe(progressData => {
            const progress = progressData.campaign_progress || {};
            progress[this.battleConfig!.id] = true;
            this.characterService.updateCharacterProgress(this.playerCharacter!.id, progress).subscribe();
        });
      }
    } else {
      this.battleResult = 'DERROTA!';
      this.addDialogEntry('Sistema', 'Você foi derrotado. Tente novamente.');
    }
  }

  returnToMap(): void {
    if (this.playerCharacter) {
      this.navigateToWorlds(this.playerCharacter.id);
    }
  }

  onExitBattle(): void {
    this.saveBattleState();
    if (this.playerCharacter) {
      this.navigateToWorlds(this.playerCharacter.id);
    }
  }

  private navigateToWorlds(characterId: string): void {
    this.router.navigate(['/game/worlds', characterId], {
      queryParams: { refresh: 'true' }
    });
  }

  addDialogEntry(speaker: string, text: string): void {
    this.dialogHistory.push({ speaker, text });
    this.shouldScrollToBottom = true;
  }

  startTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.timeLeft = 300;
    this.updateTimerDisplay();

    this.interval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
        this.handleTimeout();
      }
    }, 1000);
  }

  private handleTimeout(): void {
    if (this.isPlayerTurn && !this.isBattleOver) {
      this.addDialogEntry(this.playerCharacter!.name, 'O tempo acabou! O personagem hesita...');
      this.selectedAction = 'hesitar e não fazer nada neste turno';
      this.sendPlayerAction();
    }
  }

  private updateTimerDisplay(): void {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onInputFocus(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  onInputClick(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  }

  onInputChange(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  }

  toggleActionPanel(): void {
    if (!this.playerCharacter || !this.battleConfig || this.isLoadingAction) return;
    this.isActionPanelVisible = !this.isActionPanelVisible;
    if (this.isActionPanelVisible) {
      this.fetchActionSuggestions();
    } else {
      this.actionSuggestions = [];
    }
  }

  selectAction(action: string): void {
    this.selectedAction = action;
    this.isActionPanelVisible = false;
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  private forceScrollToBottom(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  private scrollToBottom(): void {
    try {
      if (this.chatLogContainer?.nativeElement) {
        this.chatLogContainer.nativeElement.scrollTop = this.chatLogContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Erro ao fazer scroll:', err);
    }
  }

  private loadBattleState(state: BattleState): void {
    this.battleState = state;
    this.dialogHistory = state.history;
    this.playerHealth = state.player_health;
    this.enemyHealth = state.enemy_health;
    this.isPlayerTurn = true;
    this.isBattleOver = false;
    this.forceScrollToBottom();
    this.startTimer();
  }

  private saveBattleState(): void {
    if (this.isBattleOver) return;
    if (!this.playerCharacter || !this.battleConfig) return;

    this.battleState = {
      character_id: this.playerCharacter.id,
      battle_id: this.battleConfig.id,
      battle_theme: this.battleConfig.theme,
      history: this.dialogHistory,
      player_health: this.playerHealth,
      enemy_health: this.enemyHealth,
      last_updated: new Date().toISOString()
    };
    this.campaignService.sendMessage('save_state', this.battleState);
  }
}