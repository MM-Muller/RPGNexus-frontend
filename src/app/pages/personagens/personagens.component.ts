import { Component } from '@angular/core';

@Component({
  selector: 'app-personagens',
  templateUrl: './personagens.component.html',
  styleUrls: ['./personagens.component.scss'],
})
export class PersonagensComponent {
  races = [
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

  classes = [
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
}
