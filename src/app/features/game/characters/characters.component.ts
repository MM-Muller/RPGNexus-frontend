import { Component } from '@angular/core';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class CharactersComponent {
  characters = [
    {
      name: 'Zephyr Nova',
      class: 'Guardião Estelar',
      level: 42,
      expPercentage: 65,
      power: '2.5K',
      defense: '1.8K',
      energy: '3.2K',
      status: 'online',
      avatar: '⚔️',
    },
    {
      name: 'Kaelen Vortex',
      class: 'Arquiteto do Vazio',
      level: 58,
      expPercentage: 80,
      power: '3.1K',
      defense: '2.2K',
      energy: '4.5K',
      status: 'in-game',
      avatar: '🔮',
    },
  ];
}
