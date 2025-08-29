import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss'],
})
export class HistoriaComponent implements OnInit {
  ngOnInit(): void {
    this.createStars();
  }

  createStars(): void {
    const starsContainer = document.getElementById('starsContainer');
    if (starsContainer) {
      const numberOfStars = 150;

      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';

        starsContainer.appendChild(star);
      }
    }
  }
}
