import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';

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
  description: string =
    'No vasto oceano cósmico do Nexus Galáctico, cada estrela é uma ilha de possibilidades, e cada descoberta é um passo em direção à compreensão de nosso lugar no infinito.';

  progress: number = 0;
  isLoading: boolean = true;
  showPlayButton: boolean = false;
  private progressInterval?: any;

  ngOnInit(): void {
    this.startProgressAnimation();
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
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

        setTimeout(() => {
          this.isLoading = false;
          this.showPlayButton = true;
        }, 500);
      }
    }, intervalTime);
  }

  onPlayGame(): void {
    console.log('Iniciando jogo...');
  }

  restartAnimation(): void {
    this.progress = 0;
    this.isLoading = true;
    this.showPlayButton = false;
    this.startProgressAnimation();
  }
}
