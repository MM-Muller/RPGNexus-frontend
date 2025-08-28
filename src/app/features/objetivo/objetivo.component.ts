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

  private observer!: IntersectionObserver;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  onMouseMove(e: MouseEvent): void {}
}
