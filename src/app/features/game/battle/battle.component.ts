import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject, takeUntil, map } from 'rxjs';
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
export class BattleComponent implements OnInit, OnDestroy {
  @ViewChild('chatLogContainer') private chatLogContainer!: ElementRef;

  battleConfig?: Battle;
  enemy?: Enemy;
  enemyImageUrl?: string;
  playerCharacter?: Character;
  playerHealth: number = 0;
  playerMaxHealth: number = 0;
  enemyHealth: number = 0;
  enemyMaxHealth: number = 0;
  showEndBattleModal = false;
  isReviewMode = false;
  isLoadingAction = false;
  isPlayerTurn: boolean = false;
  isBattleOver = false;
  battleResult = '';
  xpGained: number = 0;
  unlockedItemUrl: string | null = null;
  isTyping: boolean = false;
  isContentLoading = true;
  dialogHistory: DialogLine[] = [];
  selectedAction: string = '';
  actionSuggestions: string[] = [];
  isActionPanelVisible = false;
  private battleState: BattleState | null = null;
  private destroy$ = new Subject<void>();
  private currentNarrative = '';
  private interval: any;
  timeLeft: number = 300;
  timerDisplay: string = '5:00';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private battleConfigService: BattleConfigService,
    private characterService: CharacterService,
    private campaignService: CampaignService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.isReviewMode = this.route.snapshot.queryParamMap.get('review') === 'true';

    const battleId = this.route.snapshot.paramMap.get('id');
    const characterId = this.route.snapshot.paramMap.get('characterId');

    if (characterId) {
      if (this.isReviewMode) {
        this.loadBattleForReview(characterId, battleId);
      } else {
        this.loadCharacterData(characterId, battleId);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.interval) clearInterval(this.interval);
    this.saveBattleState();
    this.campaignService.disconnect();
  }

  loadCharacterData(characterId: string, battleIdFromRoute: string | null): void {
    const battleId = battleIdFromRoute || 'primordial-nebula';

    forkJoin({
      character: this.characterService.getCharacters().pipe(map(chars => chars.find(c => c.id === characterId))),
      battle: this.battleConfigService.getBattle(battleId)
    }).subscribe(({ character, battle }) => {
      if (!character || !battle) {
        this.navigateToWorlds(characterId);
        return;
      }

      this.playerCharacter = character;
      this.battleConfig = battle;
      this.enemy = { ...battle.enemy };
      this.setEnemyImageUrl();
      this.setupPlayerStats();

      this.campaignService.connect(character.id, battleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(message => {
          this.zone.run(() => {
            if (this.isContentLoading) this.isContentLoading = false;

            switch (message.type) {
              case 'load_state':
                this.loadBattleState(message.payload);
                break;
              case 'narrative_start':
                this.isLoadingAction = true;
                this.isTyping = true;
                this.dialogHistory = [];
                this.currentNarrative = '';
                break;
              case 'narrator_turn_start':
                this.currentNarrative = '';
                break;
              case 'narrative_chunk':
                this.currentNarrative += message.payload;
                break;
              case 'narrative_end':
                if (this.currentNarrative.trim()) {
                  this.addDialogEntry('Narrador', this.currentNarrative.trim());
                }
                this.processEvent(message.payload.event);
                this.isLoadingAction = false;
                this.isTyping = false;
                if (!this.isBattleOver) {
                  this.isPlayerTurn = true;
                  this.startTimer();
                }
                this.triggerRenderAndScroll();
                break;
              case 'suggestions':
                this.actionSuggestions = message.payload.suggestions;
                break;
              case 'battle_over':
                this.endBattle(message.payload.victory);
                break;
            }
          });
        });
    });
  }

  loadBattleForReview(characterId: string, battleId: string | null): void {
    if (!battleId) {
      this.navigateToWorlds(characterId);
      return;
    }

    this.isContentLoading = true;
    forkJoin({
      character: this.characterService.getCharacters().pipe(map(chars => chars.find(c => c.id === characterId))),
      battleConfig: this.battleConfigService.getBattle(battleId),
      battleState: this.campaignService.getBattleState(characterId, battleId)
    }).subscribe(({ character, battleConfig, battleState }) => {
      if (!character || !battleConfig || !battleState) {
        this.navigateToWorlds(characterId);
        return;
      }

      this.playerCharacter = character;
      this.battleConfig = battleConfig;
      this.enemy = { ...battleConfig.enemy };
      this.setEnemyImageUrl();
      this.setupPlayerStats();

      this.loadBattleState(battleState);

      this.isBattleOver = true;
      this.showEndBattleModal = false;
      this.isPlayerTurn = false;
      if (this.interval) clearInterval(this.interval);

      this.isContentLoading = false;
      this.triggerRenderAndScroll();
    });
  }

  trackByEntry(index: number, entry: DialogLine): number {
    return index;
  }

  addDialogEntry(speaker: string, text: string): void {
    const paragraphs = text.split(/\n+/).filter(p => p.trim() !== '');
    const newEntry: DialogLine = { speaker, text, paragraphs };
    this.dialogHistory = [...this.dialogHistory, newEntry];
  }

  sendPlayerAction(): void {
    if (!this.playerCharacter || this.selectedAction.trim() === '' || !this.isPlayerTurn) return;

    this.isLoadingAction = true;
    this.isPlayerTurn = false;
    this.isTyping = true;
    clearInterval(this.interval);

    const playerAction = this.selectedAction;

    this.addDialogEntry(this.playerCharacter!.name, playerAction);
    this.selectedAction = '';
    this.triggerRenderAndScroll();

    this.campaignService.sendMessage('player_action', {
      action: playerAction,
      history: this.dialogHistory.map(d => `${d.speaker}: ${d.text}`)
    });
  }

  private triggerRenderAndScroll(): void {
    this.cdr.detectChanges();
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom(): void {
    try {
      if (this.chatLogContainer?.nativeElement) {
        this.chatLogContainer.nativeElement.scrollTop = this.chatLogContainer.nativeElement.scrollHeight;
      }
    } catch (err) { console.error('Erro ao rolar a tela:', err); }
  }

  private loadBattleState(state: BattleState): void {
    this.battleState = state;
    this.dialogHistory = state.history.map(line => ({
      ...line,
      paragraphs: line.text.split(/\n+/).filter(p => p.trim() !== '')
    }));
    this.playerHealth = state.player_health;
    this.enemyHealth = state.enemy_health;
    this.isPlayerTurn = true;
    this.isBattleOver = false;
    this.startTimer();
    this.triggerRenderAndScroll();
  }

  setEnemyImageUrl(): void {
    if (this.enemy) {
      const imageName = this.enemy.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(' ')
        .map((word, index) => {
          if (index === 0) {
            return word.toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('') + '.png';

      this.enemyImageUrl = `assets/images/enemy/${imageName}`;
    }
  }

  setupPlayerStats(): void {
    if (!this.playerCharacter || !this.battleConfig) return;
    this.playerMaxHealth = 200;
    this.playerHealth = 200;

    this.enemyMaxHealth = this.battleConfig.enemy.maxHealth;
    this.enemyHealth = this.battleConfig.enemy.health;
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
    if (this.isBattleOver) return;
    this.showEndBattleModal = true;
    this.isBattleOver = true;
    this.isPlayerTurn = false;
    clearInterval(this.interval);

    if (playerWon || (this.enemy && this.enemyHealth <= 0)) {
      this.battleResult = 'VITÓRIA!';
      this.xpGained = 50;
      this.addDialogEntry('Sistema', `Você venceu a batalha e ganhou ${this.xpGained} de experiência!`);

      if (this.enemy && this.enemy.dropImage) {
        this.unlockedItemUrl = this.enemy.dropImage;
      }

      if (this.playerCharacter && this.battleConfig) {
        this.characterService.addExperience(this.playerCharacter.id, this.xpGained).subscribe({
          next: () => {
            console.log('Experiência adicionada com sucesso!');

            this.characterService.getCharacterProgress(this.playerCharacter!.id).subscribe(progressData => {
              const progress = progressData.campaign_progress || {};
              progress[this.battleConfig!.id] = true;

              this.characterService.updateCharacterProgress(this.playerCharacter!.id, progress).subscribe({
                next: () => console.log('Progresso atualizado com sucesso!'),
                error: (err) => console.error('Falha ao atualizar o progresso:', err)
              });
            });
          },
          error: (err) => console.error('Falha ao adicionar experiência:', err)
        });

        if (this.unlockedItemUrl) {
          this.characterService.addItemToInventory(this.playerCharacter.id, this.unlockedItemUrl).subscribe({
            next: () => console.log('Item adicionado ao inventário!'),
            error: (err) => console.error('Falha ao adicionar item ao inventário:', err)
          });
        }
      }
    } else {
      this.battleResult = 'DERROTA!';
      this.addDialogEntry('Sistema', 'Você foi derrotado. Tente novamente.');
    }
    this.triggerRenderAndScroll();
    this.saveBattleState();
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
    setTimeout(() => this.scrollToBottom(), 100);
  }

  onInputClick(): void {
    setTimeout(() => this.scrollToBottom(), 50);
  }

  onInputChange(): void {
    setTimeout(() => this.scrollToBottom(), 50);
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
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private saveBattleState(): void {
    if (!this.playerCharacter || !this.battleConfig) return;

    const historyToSave = this.dialogHistory.map(({ speaker, text }) => ({ speaker, text }));

    this.battleState = {
      character_id: this.playerCharacter.id,
      battle_id: this.battleConfig.id,
      battle_theme: this.battleConfig.theme,
      history: historyToSave,
      player_health: this.playerHealth,
      enemy_health: this.enemyHealth,
      last_updated: new Date().toISOString()
    };
    this.campaignService.sendMessage('save_state', this.battleState);
  }
}