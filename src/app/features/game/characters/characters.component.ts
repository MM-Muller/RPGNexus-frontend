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
      race: 'Humano',
      class: 'Aventureiro',
      description: 'Um explorador ousado com um passado misterioso, sempre em busca da próxima grande descoberta.',
      level: 42,
      expPercentage: 65,
      power: '2.5K',
      defense: '1.8K',
      energy: '3.2K',
      status: 'online',
      avatar: '⚔',
    },
    {
      name: 'Kaelen Vortex',
      race: 'Híbrido',
      class: 'Cientista',
      description: 'Uma mente brilhante que busca desvendar os segredos do Nexus, fundindo tecnologia e biologia.',
      level: 58,
      expPercentage: 80,
      power: '3.1K',
      defense: '2.2K',
      energy: '4.5K',
      status: 'online',
      avatar: '🔬',
    },
  ];

  selectedCharacter: any = null;
  isModalVisible: boolean = false;

  showDetails(character: any): void {
    this.selectedCharacter = character;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedCharacter = null;
  }

  deleteCharacter(): void {
    if (this.selectedCharacter) {
      console.log('Excluindo personagem:', this.selectedCharacter.name);
      // Aqui você pode adicionar a lógica para remover o personagem da lista
      this.characters = this.characters.filter(
        (char) => char.name !== this.selectedCharacter.name
      );
      this.closeModal();
    }
  }
}