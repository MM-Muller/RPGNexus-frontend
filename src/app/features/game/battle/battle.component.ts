import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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

  dialogHistory: DialogLine[] = [];
  selectedAction: string = '';
  actionSuggestions: string[] = [];
  isActionPanelVisible = false;

  private interval: any;
  private shouldScrollToBottom = false;
  timeLeft: number = 300;
  timerDisplay: string = '5:00';
  
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

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
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

  setupPlayerStats(): void {
    if (!this.playerCharacter || !this.enemy) return;
    this.playerMaxHealth = 200;
    this.playerHealth = 200;

    this.enemyMaxHealth = this.enemy.maxHealth;
    this.enemyHealth = this.enemy.health;
  }
  
  startBattle(characterId: string, theme: string): void {
    this.isLoadingAction = true;
    this.isTyping = true;
    this.campaignService.startBattle(characterId, theme).subscribe(response => {
      this.isTyping = false;
      this.typeWriterEffect('Narrador', response.narrativa, () => {
        this.processEvent(response);
        this.isLoadingAction = false;
        this.isPlayerTurn = true;
        this.startTimer();
      });
    });
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

    const historyTexts = this.dialogHistory.map(d => `${d.speaker}: ${d.text}`);

    this.campaignService.sendAction(this.playerCharacter.id, this.battleConfig.theme, playerAction, historyTexts)
      .subscribe((response: CampaignResponse) => {
        this.isTyping = false;
        this.typeWriterEffect('Narrador', response.narrativa, () => {
            this.processEvent(response);
            this.isLoadingAction = false;
            if (!this.isBattleOver) {
              this.isPlayerTurn = true;
              this.startTimer();
            }
            this.forceScrollToBottom();
        });
      });
  }

  typeWriterEffect(speaker: string, text: string, callback: () => void): void {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        callback();
        return;
    }

    let lineIndex = 0;
    const speed = 20;
    const dialogEntry: DialogLine = { speaker, text: '' };
    this.dialogHistory.push(dialogEntry);

    const typeLine = () => {
        if (lineIndex < lines.length) {
            let charIndex = 0;
            const currentLine = lines[lineIndex];

            const typeChar = () => {
                if (charIndex < currentLine.length) {
                    dialogEntry.text += currentLine.charAt(charIndex);
                    charIndex++;
                    this.scrollToBottom();
                    setTimeout(typeChar, speed);
                } else {
                    if (lineIndex < lines.length - 1) {
                        dialogEntry.text += '\n';
                    }
                    lineIndex++;
                    setTimeout(typeLine, 250);
                }
            };
            typeChar();
        } else {
            callback();
        }
    };

    typeLine();
  }
  
  fetchActionSuggestions(): void {
    if (!this.playerCharacter || !this.battleConfig) return;

    this.isLoadingAction = true;
    const historyTexts = this.dialogHistory.map(d => `${d.speaker}: ${d.text}`);
    this.campaignService.getActionSuggestions(this.playerCharacter.id, this.battleConfig.theme, historyTexts)
      .subscribe(response => {
        this.actionSuggestions = response.suggestions;
        this.isActionPanelVisible = true;
        this.isLoadingAction = false;
      });
  }

  processEvent(response: CampaignResponse): void {
    const event = response.evento;
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
      this.router.navigate(['/game/worlds', this.playerCharacter.id]);
    }
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
    if (this.isActionPanelVisible) {
        this.isActionPanelVisible = false;
        this.actionSuggestions = [];
    } else {
        this.fetchActionSuggestions();
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
        const element = this.chatLogContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Erro ao fazer scroll:', err);
    }
  }
  
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}