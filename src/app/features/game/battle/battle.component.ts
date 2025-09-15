import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BattleConfigService } from 'src/app/core/services/battle-config.service';
import { CharacterService } from 'src/app/core/services/character.service';
import { CampaignService } from 'src/app/core/services/campaign.service';
import { Battle, DialogLine, Enemy } from 'src/app/models/battle.model';
import { Character } from 'src/app/models/character.model';

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

  isActionPanelVisible = false;
  isLoadingAction = false;

  dialogHistory: DialogLine[] = [];
  selectedAction: string = '';

  private interval: any;
  timeLeft: number = 90;
  timerDisplay: string = '1:30';
  isPlayerTurn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private battleConfigService: BattleConfigService,
    private characterService: CharacterService,
    private campaignService: CampaignService
  ) { }

  ngOnInit(): void {
    const battleId = this.route.snapshot.paramMap.get('id');
    const characterId = this.route.snapshot.paramMap.get('characterId');

    if (battleId && characterId) {
      forkJoin({
        battle: this.battleConfigService.getBattle(battleId),
        characters: this.characterService.getCharacters()
      }).subscribe(({ battle, characters }) => {
        if (!battle) { this.router.navigate(['/game/worlds', characterId]); return; }
        
        this.battleConfig = battle;
        this.enemy = battle.enemy;
        
        const foundCharacter = characters.find(c => c.id === characterId);
        if (foundCharacter) {
          this.playerCharacter = foundCharacter;
          this.setupPlayerStats();
          this.isPlayerTurn = true;
          this.startTimer();
          this.dialogHistory.push({ speaker: 'Narrador', text: 'A batalha começa!' });
        } else {
          this.router.navigate(['/game/characters']);
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  sendPlayerAction(): void {
    if (this.selectedAction.trim() === '' || !this.isPlayerTurn) return;
    
    this.isLoadingAction = true;
    this.isPlayerTurn = false;
    const playerAction = this.selectedAction;
    this.dialogHistory.push({ speaker: this.playerCharacter!.name, text: playerAction });
    this.selectedAction = '';

    const historyTexts = this.dialogHistory.map(d => `${d.speaker}: ${d.text}`);
    const theme = (this.battleConfig as any).theme || 'Batalha Galáctica';

    this.campaignService.sendAction(this.playerCharacter!.id, theme, playerAction, historyTexts)
      .subscribe((response: any) => {
        this.dialogHistory.push({ speaker: this.enemy!.name, text: response.narrative });
        this.isLoadingAction = false;
        this.isPlayerTurn = true;
        this.timeLeft = 90;
      });
  }

  setupPlayerStats(): void {
    if (!this.playerCharacter) return;
    this.playerMaxHealth = this.playerCharacter.attributes.strength * 150;
    this.playerHealth = this.playerMaxHealth;
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      } else {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.timeLeft = 90;
      }
    }, 1000);
  }

  toggleActionPanel(): void {
    this.isActionPanelVisible = !this.isActionPanelVisible;
  }

  selectAction(action: string): void {
    this.selectedAction = action;
    this.isActionPanelVisible = false;
  }

  private scrollToBottom(): void {
    try {
      if (this.chatLogContainer) {
        this.chatLogContainer.nativeElement.scrollTop = this.chatLogContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
}