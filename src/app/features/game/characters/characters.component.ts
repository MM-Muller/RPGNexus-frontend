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

  loadCharacters(): void {
    this.characterService.getCharacters().subscribe({
      next: (data) => {
        // Mapeia os dados recebidos para o formato de exibição
        this.characters = data.map(character => ({
          ...character,
          level: 1, // Dados de exibição podem ser calculados ou fixos no futuro
          expPercentage: Math.floor(Math.random() * 100), // Exemplo de EXP
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
          this.loadCharacters(); // Recarrega a lista após a exclusão
          this.closeModal();
        },
        error: (err) => console.error('Falha ao excluir personagem:', err),
      });
    }
  }
}