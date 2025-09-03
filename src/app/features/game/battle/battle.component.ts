import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.createStars();
    this.setupEventListeners();
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

  setupEventListeners(): void {
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const button = btn as HTMLElement;
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = '';
        }, 10);

        if (button.classList.contains('attack')) {
            this.showDamage();
        }
      });
    });
  }

  showDamage(): void {
    const damageText = document.createElement('div');
    damageText.className = 'combat-effect damage-text';
    damageText.textContent = '-' + Math.floor(Math.random() * 500 + 200);
    damageText.style.left = '70%';
    damageText.style.top = '40%';
    const battleArena = document.querySelector('.battle-arena');
    if (battleArena) {
      battleArena.appendChild(damageText);
    }

    setTimeout(() => {
        damageText.remove();
    }, 1000);
  }
}