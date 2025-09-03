import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

  activeMenu: string | null = null;
  selectedAction: string = '';
  specialAttack: string = 'Raio Cósmico: 35 de dano';
  defendAction: string = 'Barreira Quântica: Reduz 50% do dano';
  item: string = 'Poção de Cura: +500 de vida';
  private menuTimeout: any;

  constructor() { }

  ngOnInit(): void {
    this.createStars();
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
    clearTimeout(this.menuTimeout);
    this.activeMenu = menu;
  }

  hideMenu(): void {
    this.menuTimeout = setTimeout(() => {
      this.activeMenu = null;
    }, 200);
  }

  selectAction(action: string): void {
    this.selectedAction = action.split(':')[0];
    this.hideMenu();
  }
}