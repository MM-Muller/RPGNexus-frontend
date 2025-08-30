import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '0.8s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  title: string = 'NEXUS';
  subtitle: string = 'GALÁCTICO';

  progress: number = 0;
  isLoading: boolean = true;
  showCompleted: boolean = false;
  showPlayButton: boolean = false;
  private progressInterval?: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startProgressAnimation();
    this.createStars();
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private createStars(): void {
    const container = document.getElementById('starsContainer');
    if (container) {
      const starCount = 150;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${Math.random() * 2 + 3}s`;
        container.appendChild(star);
      }
    }
  }

  private startProgressAnimation(): void {
    const duration = 4000;
    const steps = 100;
    const intervalTime = duration / steps;

    this.progressInterval = setInterval(() => {
      this.progress += 1;

      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(this.progressInterval);
        this.isLoading = false;
        this.showCompleted = true;

        setTimeout(() => {
          this.showCompleted = false;
          this.showPlayButton = true;
        }, 1000);
      }
    }, intervalTime);
  }

  onPlayGame(): void {
    this.router.navigate(['/login']);
  }

  restartAnimation(): void {
    this.progress = 0;
    this.isLoading = true;
    this.showCompleted = false;
    this.showPlayButton = false;
    this.startProgressAnimation();
  }
}
