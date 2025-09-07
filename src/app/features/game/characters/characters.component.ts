import { Component, OnInit } from '@angular/core';
import { Character } from '../../../models/character.model';
import { CharacterService } from 'src/app/core/services/character.service';

@Component({
  selector: 'app-characters',
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

  // A fórmula aqui DEVE ser idêntica à do backend (leveling.py)
  getExpToNextLevel(level: number): number {
    const XP_BASE = 100;
    const XP_FACTOR = 1.5;
    return Math.floor(XP_BASE * (level ** XP_FACTOR));
  }

  loadCharacters(): void {
    this.characterService.getCharacters().subscribe({
      next: (data) => {
        this.characters = data.map(character => {
          const expToNextLevel = this.getExpToNextLevel(character.level);
          const expPercentage = (character.experience / expToNextLevel) * 100;
          
          return {
            ...character,
            expPercentage: expPercentage,
          };
        });
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
          this.loadCharacters(); // Recarrega a lista após a exclusão
          this.closeModal();
        },
        error: (err) => console.error('Falha ao excluir personagem:', err),
      });
    }
  }
}