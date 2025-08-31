import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = 'NEXUS';
  subtitle: string = 'GALÁCTICO';
  description: string =
    'No vasto oceano cósmico do Nexus Galáctico, cada estrela é uma ilha de possibilidades, e cada descoberta é um passo em direção à compreensão de nosso lugar no infinito.';

  progress: number = 0;
  isLoading: boolean = true;
  showCompleted: boolean = false;
  showPlayButton: boolean = false;
  private progressInterval?: any;
  private animationFrameId?: number; // Para controlar o loop de animação do canvas

  constructor(private router: Router, private el: ElementRef) {}

  ngOnInit(): void {
    this.startProgressAnimation();
  }

  ngAfterViewInit(): void {
    this.initNeuralCanvas(); // Inicializa o canvas neural após a view ser carregada
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId); // Limpa a animação do canvas ao destruir o componente
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
    this.router.navigate(['/login']); // Exemplo de navegação, ajuste conforme necessário
  }

  restartAnimation(): void {
    this.progress = 0;
    this.isLoading = true;
    this.showCompleted = false;
    this.showPlayButton = false;
    this.startProgressAnimation();
  }

  private initNeuralCanvas(): void {
    const canvas = this.el.nativeElement.querySelector('#neuralCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    // Ajuste o número de partículas se necessário para performance ou densidade
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Tamanho das partículas
        this.speedX = Math.random() * 1 - 0.5; // Velocidade em X (-0.5 a 0.5)
        this.speedY = Math.random() * 1 - 0.5; // Velocidade em Y (-0.5 a 0.5)
      }

      update() {
        // Inverte a direção se a partícula atingir as bordas
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Cor dourada/amarelada das partículas
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = Math.sqrt(
            Math.pow(particles[a].x - particles[b].x, 2) +
              Math.pow(particles[a].y - particles[b].y, 2)
          );
          // Conecta partículas se estiverem próximas o suficiente
          if (distance < 100) {
            opacityValue = 1 - distance / 100;
            // Cor das linhas que conectam as partículas (roxo/magenta)
            ctx.strokeStyle = `rgba(138, 43, 226, ${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada frame
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      connectParticles();
      this.animationFrameId = requestAnimationFrame(animate); // Continua o loop de animação
    };

    initParticles(); // Inicializa as partículas
    animate(); // Inicia a animação

    // Redimensiona o canvas e reinicia as partículas ao redimensionar a janela
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });
  }
}
