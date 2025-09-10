import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BattleConfigService } from 'src/app/core/services/battle-config.service';
import { CharacterService } from 'src/app/core/services/character.service';
import { Battle, DialogLine, Enemy } from 'src/app/models/battle.model';
import { Character } from 'src/app/models/character.model';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit, OnDestroy {

  battleConfig?: Battle;
  enemy?: Enemy;
  dialog: DialogLine[] = [];
  
  playerCharacter?: Character;
  playerHealth: number = 0;
  playerMaxHealth: number = 0;
  playerEnergy: number = 0;
  playerMaxEnergy: number = 0;
  playerPower: number = 0;
  playerMaxPower: number = 0;

  activeMenu: string | null = null;
  selectedAction: string = '';
  specialAttack: string = 'Raio Cósmico: 35 de dano';
  defendAction: string = 'Barreira Quântica: Reduz 50% do dano';
  item: string = 'Poção de Cura: +500 de vida';
  private menuTimeout: any;

  timeLeft: number = 90;
  timerDisplay: string = '1:30';
  isPlayerTurn: boolean = true;
  private interval: any;

  showDialog = true;
  currentDialogIndex = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private battleConfigService: BattleConfigService,
    private characterService: CharacterService
  ) { }

  ngOnInit(): void {
    const battleId = this.route.snapshot.paramMap.get('id');
    const characterId = this.route.snapshot.paramMap.get('characterId');

    if (battleId && characterId) {
      forkJoin({
        battle: this.battleConfigService.getBattle(battleId),
        characters: this.characterService.getCharacters() 
      }).subscribe(({ battle, characters }) => {
        if (battle) {
          this.battleConfig = battle;
          this.dialog = battle.dialog;
          this.enemy = battle.enemy;
        } else {
          this.router.navigate(['/game/worlds', characterId]);
          return;
        }

        const foundCharacter = characters.find(c => c.id === characterId);
        if (foundCharacter) {
          this.playerCharacter = foundCharacter;
          this.setupPlayerStats();
        } else {
          this.router.navigate(['/game/characters']);
          return;
        }
      });
    }
  }

  setupPlayerStats(): void {
    if (!this.playerCharacter) return;

    this.playerMaxHealth = this.playerCharacter.attributes.strength * 150;
    this.playerHealth = this.playerMaxHealth; 

    this.playerMaxEnergy = this.playerCharacter.attributes.intelligence * 200;
    this.playerEnergy = this.playerMaxEnergy;
    
    this.playerMaxPower = this.playerCharacter.attributes.dexterity * 100;
    this.playerPower = this.playerMaxPower;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  nextDialog() {
    if (this.currentDialogIndex < this.dialog.length - 1) {
      this.currentDialogIndex++;
    } else {
      this.showDialog = false;
      this.startTimer();
    }
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

  showMenu(menu: string): void {
    if (!this.isPlayerTurn) return;
    clearTimeout(this.menuTimeout);
    this.activeMenu = menu;
  }

  hideMenu(): void {
    this.menuTimeout = setTimeout(() => {
      this.activeMenu = null;
    }, 200);
  }

  selectAction(action: string): void {
    if (!this.isPlayerTurn) return;
    this.selectedAction = action.split(':')[0];
    this.hideMenu();
  }
}