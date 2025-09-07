import { Component, OnInit } from '@angular/core';
import { Character } from '../../../models/character.model';
import { CharacterService } from 'src/app/core/services/character.service'; 

@Component({
  selector: 'app-personagens',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class CharactersComponent implements OnInit {
  characters: Character[] = [];
  selectedCharacter: Character | null = null;
  isModalVisible: boolean = false;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.characterService.getCharacters().subscribe({
      next: (data) => {
        this.characters = data.map(character => ({
          ...character,
          level: 1,
          expPercentage: Math.floor(Math.random() * 100),
          power: `${(character.attributes.strength * 10)}`,
          defense: `${(character.attributes.dexterity * 10)}`,
          energy: `${(character.attributes.intelligence * 10)}`,
          status: 'online',
          avatar: character.class_icon,
        }));
      },
      error: (err) => console.error('Falha ao carregar personagens:', err),
    });
  }

  showDetails(character: Character): void {
    this.selectedCharacter = character;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedCharacter = null;
  }

  deleteCharacter(): void {
    if (this.selectedCharacter) {
      this.characterService.deleteCharacter(this.selectedCharacter.id).subscribe({
        next: () => {
          console.log('Personagem excluído:', this.selectedCharacter?.name);
          this.loadCharacters();
          this.closeModal();
        },
        error: (err) => console.error('Falha ao excluir personagem:', err),
      });
    }
  }
}
