import { Component, OnInit } from '@angular/core';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-personagens',
  templateUrl: './personagens.component.html',
  styleUrls: ['./personagens.component.scss'],
})
export class PersonagensComponent implements OnInit {
  races: Character[] = [
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

  ngOnInit(): void {
    this.createStars();
  }

  createStars(): void {
    const starsContainer = document.getElementById('starsContainer');
    if (starsContainer) {
      // Limpa estrelas existentes para evitar duplicação na navegação
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
}
