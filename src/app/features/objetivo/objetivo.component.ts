import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Objective } from '../../models/objective.model';

@Component({
  selector: 'app-objetivo',
  templateUrl: './objetivo.component.html',
  styleUrls: ['./objetivo.component.scss'],
})
export class ObjetivoComponent implements OnInit, OnDestroy {
  shortTermObjectives: Objective[] = [
    {
      title: 'Exploração do Setor Alfa-7',
      description:
        'Mapeie sistemas estelares desconhecidos e estabeleça postos avançados para expansão territorial.',
      progress: 0,
    },
    {
      title: 'Primeiro Contato Xenológico',
      description:
        'Inicie protocolos diplomáticos com a civilização Etherean detectada no quadrante exterior.',
      progress: 0,
    },
    {
      title: 'Descoberta de Artefatos Quânticos',
      description:
        'Recupere tecnologia ancestral das ruínas de Kepler-442b para avanços científicos.',
      progress: 0,
    },
    {
      title: 'Estabilização de Rotas Comerciais',
      description:
        'Proteja corredores hiperespaciais contra piratas e anomalias gravitacionais.',
      progress: 0,
    },
  ];

  longTermObjectives: Objective[] = [
    {
      title: 'Decifrar o Código dos Antigos',
      description:
        'Desvende os segredos da civilização precursora que moldou a galáxia há eons.',
      progress: 0,
    },
    {
      title: 'Construir o Portal Intergaláctico',
      description:
        'Complete a megaestrutura que permitirá viagens instantâneas entre galáxias vizinhas.',
      progress: 0,
    },
    {
      title: 'Alcançar a Singularidade Coletiva',
      description:
        'Uma consciências orgânicas e sintéticas em uma rede neural galáctica transcendente.',
      progress: 0,
    },
    {
      title: 'Prevenir o Colapso Entrópico',
      description:
        'Desenvolva tecnologia para reverter a morte térmica do universo e garantir a eternidade.',
      progress: 0,
    },
  ];

  private intervalId: any;
  private unlistenMouseMove!: () => void;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.generateStarfield();
    this.startGlitchEffect();
    this.setupParallax();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
    }
  }

  private generateStarfield(): void {
    this.ngZone.runOutsideAngular(() => {
      const starfield = this.el.nativeElement.querySelector('#starfield');
      if (starfield) {
        for (let i = 0; i < 200; i++) {
          const star = this.renderer.createElement('div');
          this.renderer.addClass(star, 'star');
          this.renderer.setStyle(star, 'left', `${Math.random() * 100}%`);
          this.renderer.setStyle(star, 'top', `${Math.random() * 100}%`);
          this.renderer.setStyle(
            star,
            'animationDelay',
            `${Math.random() * 3}s`
          );
          this.renderer.setStyle(
            star,
            'opacity',
            `${Math.random() * 0.8 + 0.2}`
          );
          this.renderer.appendChild(starfield, star);
        }
      }
    });
  }

  private startGlitchEffect(): void {
    const title = this.el.nativeElement.querySelector('.title');
    if (title) {
      this.intervalId = setInterval(() => {
        this.renderer.setStyle(title, 'animation', 'glitch 0.3s');
        setTimeout(() => {
          this.renderer.setStyle(
            title,
            'animation',
            'energyFlow 3s infinite linear'
          );
        }, 300);
      }, 10000);
    }
  }

  private setupParallax(): void {
    this.ngZone.runOutsideAngular(() => {
      this.unlistenMouseMove = this.renderer.listen(
        'document',
        'mousemove',
        (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;

          const nebula = this.el.nativeElement.querySelector('.nebula');
          const stars = this.el.nativeElement.querySelector('.stars');

          if (nebula) {
            this.renderer.setStyle(
              nebula,
              'transform',
              `translate(${x}px, ${y}px)`
            );
          }
          if (stars) {
            this.renderer.setStyle(
              stars,
              'transform',
              `translate(${-x * 0.5}px, ${-y * 0.5}px)`
            );
          }
        }
      );
    });
  }

  onMouseMove(event: MouseEvent) {
    // This empty method is needed for the (mousemove) event binding in the template
  }
}
