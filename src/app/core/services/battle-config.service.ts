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
      dialog: [
        { speaker: 'Sentinela do Vazio', text: 'Olá, aventureiro. Vejo que chegou longe. Mas esta é a barreira final.' },
        { speaker: 'Zephyr Nova', text: 'Quem é você? E por que me impede de avançar?' },
        { speaker: 'Sentinela do Vazio', text: 'Eu sou a Sentinela do Vazio, guardiã deste setor. Minha programação é clara: nenhum intruso pode passar.' },
        { speaker: 'Zephyr Nova', text: 'Sua ordem de vazio terminará aqui!' },
        { speaker: 'Sentinela do Vazio', text: 'Prepare-se para ser absorvido pelo esquecimento.' }
      ],
      enemy: {
        name: 'Sentinela do Vazio',
        health: 5000,
        maxHealth: 5000,
      }
    },
    {
      id: 'purple-vortex',
      title: '🌀 Confronto no Vórtice 🌀',
      dialog: [
        { speaker: 'Eco Dimensional', text: 'Sua realidade se desfaz... Viajante. O que busca nas dobras do tempo?' },
        { speaker: 'Zephyr Nova', text: 'Busco respostas! Quem é você?' },
        { speaker: 'Eco Dimensional', text: 'Sou um fragmento de todas as possibilidades. Para passar, deve provar que sua realidade merece existir.' },
      ],
      enemy: {
        name: 'Eco Dimensional',
        health: 4500,
        maxHealth: 4500,
      }
    }
    // Adicionar as outras batalhas aqui
  ];

  constructor() { }

  getBattle(id: string): Observable<Battle | undefined> {
    return of(this.battles.find(b => b.id === id));
  }
}