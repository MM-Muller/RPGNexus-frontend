import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Battle } from '../../models/battle.model';

@Injectable({
  providedIn: 'root'
})
export class BattleConfigService {

  private battles: Battle[] = [
    {
      id: 'primordial-nebula',
      title: '🌟 Conflito na Nebulosa 🌟',
      theme: 'Encontro com uma entidade elemental que protege a Nebulosa Primordial.',
      enemy: {
        name: 'Guardião Elemental',
        health: 450,
        maxHealth: 450,
        dropImage: "assets/images/drops/dropGuardiaoElemental.png"
      },
    },
    {
      id: 'aurelion-guardian',
      title: '⚡ Batalha Galáctica ⚡',
      theme: 'Confronto com o guardião dourado de um sistema estelar antigo.',
      enemy: {
        name: 'Sentinela do Vazio',
        health: 500,
        maxHealth: 500,
        dropImage: "assets/images/drops/dropSentinelaDoVazio.png"
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
        dropImage: "assets/images/drops/dropEcoDimensional.png"
      }
    },
    {
      id: 'azurite-constellation',
      title: '💎 Caçada ao Arquiteto 💎',
      theme: 'Infiltração na fortaleza dos Arquitetos do Vazio para desativar suas defesas.',
      enemy: {
        name: 'Arquiteto de Cristal',
        health: 600,
        maxHealth: 600,
        dropImage: "assets/images/drops/dropArquitetodeCristal.png"
      }
    },
    {
      id: 'central-nexus',
      title: '🌌 O Coração do Nexus 🌌',
      theme: 'Batalha pela estabilidade do Nexus Central contra uma anomalia disruptiva.',
      enemy: {
        name: 'Anomalia Convergente',
        health: 850,
        maxHealth: 850,
        dropImage: "assets/images/drops/dropAnomaliaConvergente.png"
      }
    },
    {
      id: 'crystal-galaxy',
      title: '🎶 Desafio do Som Cósmico 🎶',
      theme: 'Uma disputa de frequência e ressonância contra um Harmônico.',
      enemy: {
        name: 'Cantor Harmônico',
        health: 550,
        maxHealth: 550,
        dropImage: "assets/images/drops/dropCantorHarmonico.png"
      }
    },
    {
      id: 'star-cluster',
      title: '✨ O Enxame Celeste ✨',
      theme: 'Repelindo um enxame de criaturas exóticas e predadoras no aglomerado estelar.',
      enemy: {
        name: 'Rainha do Enxame',
        health: 700,
        maxHealth: 700,
        dropImage: "assets/images/drops/dropRainhadoEnxame.png"
      }
    }
  ];

  constructor() { }

  getBattle(id: string): Observable<Battle | undefined> {
    return of(this.battles.find(b => b.id === id));
  }
}