import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';

interface Enemy {
  name: string;
  description: string;
  image: string;
  dropDescription: string;
  dropImage: string;
}

@Component({
  selector: 'app-objetivo',
  templateUrl: './objetivo.component.html',
  styleUrls: ['./objetivo.component.scss'],
})
export class ObjetivoComponent implements OnInit, OnDestroy, AfterViewInit {
  enemies: Enemy[] = [
    {
      name: 'Rainha do Enxame',
      description: 'A mente coletiva de uma raça de insetoides espaciais. Controla milhões de zangões com sua vontade, coordenando ataques em uma escala planetária.',
      image: 'assets/images/enemy/rainhaDoEnxame.png',
      dropDescription: 'Glândula de Feromônios: Permite a criação de drones de combate que auxiliam o jogador em batalha ou aprimoramentos que aumentam o dano contra enxames inimigos.',
      dropImage: 'assets/images/drops/dropRainhadoEnxame.png'
    },
    {
      name: 'Guardião Elemental',
      description: 'Uma entidade elemental que protege a Nebulosa Primordial, um ser de pura energia cósmica, com ataques que manipulam a matéria e a energia do ambiente.',
      image: 'assets/images/enemy/guardiaoElemental.png',
      dropDescription: 'Fragmento Primordial: Um cristal que pulsa com a energia da criação, usado para aprimorar armas com dano elemental.',
      dropImage: 'assets/images/drops/dropGuardiaoElemental.png'
    },
    {
      name: 'Sentinela do Vazio',
      description: 'Um guardião dourado de um sistema estelar antigo, com a habilidade de prever movimentos e contra-atacar com precisão.',
      image: 'assets/images/enemy/sentinelaDoVazio.png',
      dropDescription: 'Núcleo de Previsão: Um artefato que, quando integrado a sistemas de naves, melhora a precisão de armas e a eficiência de escudos.',
      dropImage: 'assets/images/drops/dropSentinelaDoVazio.png'
    },
    {
      name: 'Arquiteto de Cristal',
      description: 'Uma entidade cristalina que molda a realidade ao seu redor, criando estruturas de energia sólida para atacar e se defender.',
      image: 'assets/images/enemy/arquitetoDeCristal.png',
      dropDescription: 'Essência do Arquiteto: Um cristal que permite a construção de itens e melhorias avançadas para a nave e equipamentos.',
      dropImage: 'assets/images/drops/dropArquitetodeCristal.png'
    },
    {
      name: 'Anomalia Convergente',
      description: 'Uma singularidade instável que distorce o espaço-tempo, atraindo e repelindo matéria de forma caótica e imprevisível.',
      image: 'assets/images/enemy/anomaliaConvergente.png',
      dropDescription: 'Fragmento de Singularidade: Um pedaço de espaço-tempo condensado que pode ser usado para criar dispositivos de teletransporte de curto alcance ou munição que ignora escudos.',
      dropImage: 'assets/images/drops/dropAnomaliaConvergente.png'
    },
    {
      name: 'Cantor Harmônico',
      description: 'Uma criatura que se comunica através de frequências sônicas, capaz de gerar ondas de choque devastadoras e manipular a mente de seres menos evoluídos com sua canção.',
      image: 'assets/images/enemy/cantorHarmonico.png',
      dropDescription: 'Coração Ressonante: Um órgão cristalino que vibra em uma frequência única, usado para criar módulos de armas sônicas ou aprimorar os sensores da nave.',
      dropImage: 'assets/images/drops/dropCantorHarmonico.png'
    },
    {
      name: 'Eco Dimensional',
      description: 'Um fantasma de outra realidade, que atravessa as barreiras do universo. Seus ataques não afetam a matéria, mas sim a alma de seus alvos.',
      image: 'assets/images/enemy/ecoDimensional.png',
      dropDescription: 'Essência Etérea: Uma substância que permite a criação de camuflagem interdimensional ou escudos que protegem contra ataques psíquicos.',
      dropImage: 'assets/images/drops/dropEcoDimensional.png'
    },
  ];

  private animationFrameId: number | undefined;

  constructor(private el: ElementRef) { }

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