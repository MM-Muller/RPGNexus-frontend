import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BattleConfigService } from 'src/app/core/services/battle-config.service';
import { CharacterService } from 'src/app/core/services/character.service';
import { CampaignService } from 'src/app/core/services/campaign.service';
import { Battle, DialogLine, Enemy } from 'src/app/models/battle.model';
import { Character } from 'src/app/models/character.model';
import { CampaignResponse } from 'src/app/models/campaign.model';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit, OnDestroy {
  @ViewChild('chatLogContainer') private chatLogContainer!: ElementRef;

  battleConfig?: Battle;
  enemy?: Enemy;
  playerCharacter?: Character;

  playerHealth: number = 0;
  playerMaxHealth: number = 0;

  isLoadingAction = false;
  isPlayerTurn: boolean = false;
  isBattleOver = false;
  battleResult = '';

  dialogHistory: DialogLine[] = [];
  selectedAction: string = '';

  private interval: any;
  timeLeft: number = 60;
  timerDisplay: string = '1:00';
  isActionPanelVisible = false;

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

    if (battleId && characterId) {
      this.loadInitialData(battleId, characterId);
    }
  }

  loadInitialData(battleId: string, characterId: string): void {
    forkJoin({
      battle: this.battleConfigService.getBattle(battleId),
      characters: this.characterService.getCharacters()
    }).subscribe(({ battle, characters }) => {
      if (!battle) { this.router.navigate(['/game/worlds', characterId]); return; }

      this.battleConfig = battle;
      this.enemy = { ...battle.enemy };

      const foundCharacter = characters.find(c => c.id === characterId);
      if (foundCharacter) {
        this.playerCharacter = foundCharacter;
        this.setupPlayerStats();
        this.startBattle(characterId, battle.theme);
      } else {
        this.router.navigate(['/game/characters']);
      }
    });
  }

  startBattle(characterId: string, theme: string): void {
    this.isLoadingAction = true;
    this.campaignService.startBattle(characterId, theme).subscribe(response => {
      this.addDialogEntry('Narrador', response.narrativa);
      this.processEvent(response);
      this.isLoadingAction = false;
      this.isPlayerTurn = true;
      this.startTimer();
    });
  }

  sendPlayerAction(): void {
    if (!this.playerCharacter || !this.battleConfig || this.selectedAction.trim() === '' || !this.isPlayerTurn || this.isBattleOver) return;
    
    this.isLoadingAction = true;
    this.isPlayerTurn = false;
    clearInterval(this.interval);

    const playerAction = this.selectedAction;
    this.addDialogEntry(this.playerCharacter.name, playerAction);
    this.selectedAction = '';

    const historyTexts = this.dialogHistory.map(d => `${d.speaker}: ${d.text}`);

    this.campaignService.sendAction(this.playerCharacter.id, this.battleConfig.theme, playerAction, historyTexts)
      .subscribe((response: CampaignResponse) => {
        this.addDialogEntry('Narrador', response.narrativa);
        this.processEvent(response);
        this.isLoadingAction = false;
        
        if (!this.isBattleOver) {
          this.isPlayerTurn = true;
          this.startTimer();
        }
      });
  }

  processEvent(response: CampaignResponse): void {
    const event = response.evento;
    if (!event) return;

    if (event.danoRecebido && this.playerCharacter) {
      this.playerHealth = Math.max(0, this.playerHealth - event.danoRecebido);
    }
    if (event.danoCausado && this.enemy) {
      this.enemy.health = Math.max(0, this.enemy.health - event.danoCausado);
    }

    if (event.tipo === 'fim' || this.playerHealth <= 0 || (this.enemy && this.enemy.health <= 0)) {
      this.endBattle(event.vitoria);
    }
  }

  endBattle(playerWon?: boolean): void {
    this.isBattleOver = true;
    this.isPlayerTurn = false;
    clearInterval(this.interval);

    if (playerWon || (this.enemy && this.enemy.health <= 0)) {
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
      this.router.navigate(['/game/worlds', this.playerCharacter.id]);
    }
  }

  addDialogEntry(speaker: string, text: string): void {
    const container = this.chatLogContainer.nativeElement;
    const shouldScroll = container.scrollTop + container.clientHeight >= container.scrollHeight - 30;

    this.dialogHistory.push({ speaker, text });

    if (shouldScroll) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  setupPlayerStats(): void {
    if (!this.playerCharacter) return;
    this.playerMaxHealth = this.playerCharacter.attributes.strength * 150;
    this.playerHealth = this.playerMaxHealth;
  }

  startTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.timeLeft = 60;
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

  toggleActionPanel(): void { this.isActionPanelVisible = !this.isActionPanelVisible; }
  selectAction(action: string): void { this.selectedAction = action; this.isActionPanelVisible = false; }
  
  ngOnDestroy(): void { 
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  
  private scrollToBottom(): void {
    try {
      if (this.chatLogContainer) {
        this.chatLogContainer.nativeElement.scrollTop = this.chatLogContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
}