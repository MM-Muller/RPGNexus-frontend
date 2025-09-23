import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Battle } from '../../models/battle.model';

@Injectable({
  providedIn: 'root'
})
export class BattleConfigService {

  private battles: Battle[] = [
    {
      id: 'aurelion-guardian',
      title: '⚡ Batalha Galáctica ⚡',
      theme: 'Confronto com o guardião dourado de um sistema estelar antigo.',
      enemy: {
        name: 'Sentinela do Vazio',
        health: 500,
        maxHealth: 500,
      }
    },
    {
      id: 'purple-vortex',
      title: '🌀 Confronto no Vórtice 🌀',
      theme: 'Encontro com uma entidade de um vórtex dimensional perdido.',
      enemy: {
        name: 'Eco Dimensional',
        health: 750,
        maxHealth: 750,
      }
    }
    // Adicionar as outras batalhas aqui
  ];

  constructor() { }

  getBattle(id: string): Observable<Battle | undefined> {
    return of(this.battles.find(b => b.id === id));
  }
}