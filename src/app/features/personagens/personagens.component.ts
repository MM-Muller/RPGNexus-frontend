import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Archetype } from '../../models/archetype.model';

@Component({
  selector: 'app-personagens',
  templateUrl: './personagens.component.html',
  styleUrls: ['./personagens.component.scss'],
})
export class PersonagensComponent implements OnInit, AfterViewInit, OnDestroy {
  races: Archetype[] = [
    {
      subtype: 'human',
      title: 'HUMANO',
      description:
        'Versáteis exploradores da Terra, conhecidos por sua adaptabilidade e determinação. Possuem grande capacidade de aprendizado e trabalho em equipe.',
    },
    {
      subtype: 'synthetic',
      title: 'SINTÉTICO',
      description:
        'Inteligências artificiais em corpos robóticos avançados. Possuem capacidades de processamento superiores e resistência extrema.',
    },
    {
      subtype: 'hybrid',
      title: 'HÍBRIDO',
      description:
        'Meio-humanos com modificações genéticas avançadas. Combinam intuição humana com melhorias biológicas específicas.',
    },
    {
      subtype: 'expatriate',
      title: 'EXPATRIADO',
      description:
        'Humanos nascidos no espaço, completamente adaptados ao vazio cósmico. Possuem resistência natural à gravidade zero.',
    },
  ];

  classes: Archetype[] = [
    {
      subtype: 'scientist',
      title: 'CIENTISTA',
      description:
        'Especialista em análise e descobertas arqueológicas espaciais. Mestre em pesquisa e decodificação de tecnologias alienígenas.',
    },
    {
      subtype: 'pilot',
      title: 'PILOTO',
      description:
        'Mestre em navegação e combate espacial. Especializado no controle de naves e manobras evasivas em gravidade zero.',
    },
    {
      subtype: 'diplomat',
      title: 'DIPLOMATA',
      description:
        'Focado em primeiros contatos e negociações interestelares. Especialista em comunicação e linguística xenológica.',
    },
    {
      subtype: 'adventurer',
      title: 'AVENTUREIRO',
      description:
        'Equilibrado em todas as habilidades e altamente adaptável. Combina múltiplas competências para qualquer situação.',
    },
  ];

  private animationFrameId?: number;

  private raceIcons: { [key: string]: string } = {
    'HUMANO': '🌍',
    'SINTÉTICO': '🤖',
    'HÍBRIDO': '🧬',
    'EXPATRIADO': '🚀'
  };

  private classIcons: { [key: string]: string } = {
    'CIENTISTA': '🔭',
    'PILOTO': '✈️',
    'DIPLOMATA': '🕊️',
    'AVENTUREIRO': '⚔️'
  };

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
      starsContainer.innerHTML = '';
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

  getRaceIcon(title: string): string {
    return this.raceIcons[title] || '';
  }

  getClassIcon(title: string): string {
    return this.classIcons[title] || '';
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