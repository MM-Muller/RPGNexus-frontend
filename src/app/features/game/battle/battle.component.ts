import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit, OnDestroy {

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
  dialog = [
    { speaker: 'Sentinela do Vazio', text: 'Olá, aventureiro. Vejo que chegou longe. Mas esta é a barreira final.' },
    { speaker: 'Zephyr Nova', text: 'Quem é você? E por que me impede de avançar?' },
    { speaker: 'Sentinela do Vazio', text: 'Eu sou a Sentinela do Vazio, guardiã deste setor. Minha programação é clara: nenhum intruso pode passar. Eu sou a manifestação da entropia, o fim de toda a ordem.' },
    { speaker: 'Zephyr Nova', text: 'Entropia? Eu sou Zephyr Nova, e trago a luz da esperança! Sua ordem de vazio terminará aqui!' },
    { speaker: 'Sentinela do Vazio', text: 'Tolice. A esperança é apenas um delírio temporário. Prepare-se para ser absorvido pelo esquecimento.' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.createStars();
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

  createStars(): void {
    const starsContainer = document.getElementById('starsContainer');
    if (starsContainer) {
        const numberOfStars = 200;
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.background = '#fff';
            star.style.borderRadius = '50%';
            const size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            starsContainer.appendChild(star);
        }
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
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