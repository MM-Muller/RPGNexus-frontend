import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Objective } from '../../models/objective.model';

@Component({
  selector: 'app-objetivo',
  templateUrl: './objetivo.component.html',
  styleUrls: ['./objetivo.component.scss'],
})
export class ObjetivoComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = 'OBJETIVOS CÓSMICOS';
  subtitle: string = 'Nexus Galáctico';

  shortTermObjectives: Objective[] = [
    {
      title: 'Exploração Estelar',
      description:
        'Descobrir sistemas solares desconhecidos e mapear anomalias espaciais no braço exterior da galáxia.',
      progress: 35,
    },
    {
      title: 'Primeiros Contatos',
      description:
        'Estabelecer comunicação pacífica com inteligências alienígenas através de protocolos diplomáticos.',
      progress: 20,
    },
    {
      title: 'Arqueologia Cósmica',
      description:
        'Recuperar artefatos e tecnologias únicas de civilizações perdidas nas Estruturas Guardiãs.',
      progress: 45,
    },
    {
      title: 'Sobrevivência Nexus',
      description:
        'Navegar com segurança através das anomalias temporais e singularidades artificiais.',
      progress: 60,
    },
  ];

  longTermObjectives: Objective[] = [
    {
      title: 'Segredo dos Guardiões',
      description:
        'Desvendar o mistério completo das Estruturas Guardiãs e sua conexão com a transcendência cósmica.',
      progress: 15,
    },
    {
      title: 'Ponte Galáctica',
      description:
        'Construir alianças duradouras entre civilizações através das Correntes Harmônicas.',
      progress: 25,
    },
    {
      title: 'Ascensão Evolutiva',
      description:
        'Descobrir o destino das espécies transcendentes e o caminho para a evolução cósmica.',
      progress: 10,
    },
    {
      title: 'Cartografia Harmônica',
      description:
        'Mapear completamente as Correntes Harmônicas e dominar a navegação dimensional.',
      progress: 30,
    },
  ];

  private animationFrameId: number | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createStars();
  }

  ngAfterViewInit(): void {
    this.initNeuralCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  createStars(): void {
    const starsContainer =
      this.el.nativeElement.querySelector('#starsContainer');
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

  private initNeuralCanvas(): void {
    const canvas = this.el.nativeElement.querySelector('#neuralCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
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
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
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
          if (distance < 100) {
            opacityValue = 1 - distance / 100;
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      connectParticles();
      this.animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });
  }
}
