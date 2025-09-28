import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CharacterService } from 'src/app/core/services/character.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Character } from '../../../models/character.model';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {

  characters: Character[] = [];
  selectedCharacter: Character | null = null;
  isModalVisible = false;

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCharacters();
  }

  getExpToNextLevel(level: number): number {
    const XP_BASE = 100;
    const XP_FACTOR = 1.5;
    return Math.floor(XP_BASE * (level ** XP_FACTOR));
  }

  loadCharacters(): void {
    this.characterService.getCharacters().subscribe(
      (data) => {
        this.characters = data.map((char: Character) => ({
          ...char,
          expPercentage: (char.experience / this.getExpToNextLevel(char.level)) * 100
        }));
      },
      (error) => {
        console.error('Erro ao buscar personagens:', error);
        this.snackBar.open('Falha ao carregar personagens.', 'Fechar', { duration: 3000 });
      }
    );
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
    if (!this.selectedCharacter) return;

    const characterId = this.selectedCharacter.id;

    this.characterService.deleteCharacter(characterId).subscribe(
      () => {
        this.snackBar.open('Personagem excluído com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.characters = this.characters.filter(char => char.id !== characterId);
        this.closeModal();
      },
      (error) => {
        this.snackBar.open('Erro ao excluir personagem.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        console.error('Erro ao deletar personagem:', error);
      }
    );
  }
}