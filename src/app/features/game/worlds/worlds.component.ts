import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../models/character.model';

@Component({
  selector: 'app-worlds',
  templateUrl: './worlds.component.html',
  styleUrls: ['./worlds.component.scss'],
})
export class WorldsComponent implements OnInit, OnDestroy {
  characterId: string | null = null;
  campaignProgress: { [worldName: string]: boolean } = {};
  character?: Character;

  completedWorlds: Set<string> = new Set();

  private queryParamsSubscription?: Subscription;
  private paramMapSubscription?: Subscription;

  worldDependencies: { [key: string]: string[] } = {
    'sistema-aurelion': ['nebula-primordial'],
    'nexus-central': ['sistema-aurelion'],
    'vortice-purpura': ['sistema-aurelion'],
    'aglomerado-estelar': ['nexus-central'],
    'galaxia-cristalina': ['nexus-central', 'vortice-purpura'],
    'constelacao-azurite': ['vortice-purpura'],
    'omega-singularity': ['galaxia-cristalina', 'aglomerado-estelar', 'constelacao-azurite']
  };

  worlds = [
    { id: 'nebula-primordial', name: 'Nebula Primordial', description: 'O Começo de Tudo', image: 'assets/images/worlds/1.png', position: { left: '15%', top: '30%' } },
    { id: 'sistema-aurelion', name: 'Sistema Aurelion', description: 'Onde o Sol Canta', image: 'assets/images/worlds/2.png', position: { left: '35%', top: '25%' } },
    { id: 'nexus-central', name: 'Nexus Central', description: 'O Coração da Galáxia', image: 'assets/images/worlds/3.png', position: { left: '40%', top: '50%' } },
    { id: 'vortice-purpura', name: 'Vórtice Púrpura', description: 'Um redemoinho de caos e poder', image: 'assets/images/worlds/4.png', position: { left: '50%', top: '40%' } },
    { id: 'aglomerado-estelar', name: 'Aglomerado Estelar', description: 'Um berçário de novas estrelas', image: 'assets/images/worlds/5.png', position: { left: '20%', top: '70%' } },
    { id: 'constelacao-azurite', name: 'Constelação Azurite', description: 'Um caminho de cristais e luz', image: 'assets/images/worlds/6.png', position: { left: '65%', top: '35%' } },
    { id: 'galaxia-cristalina', name: 'Galáxia Cristalina', description: 'Onde as estrelas são diamantes', image: 'assets/images/worlds/7.png', position: { left: '55%', top: '60%' } },
    { id: 'omega-singularity', name: 'Singularidade Omega', description: 'Um enigma cósmico de poder inimaginável', image: 'assets/images/worlds/8.png', position: { left: '80%', top: '55%' } }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService
  ) { }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (params['refresh'] === 'true') {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        }).then(() => {
          window.location.reload();
        });
        return;
      }
    });

    this.paramMapSubscription = this.route.paramMap.subscribe(params => {
      this.characterId = params.get('characterId');
      if (this.characterId) {
        this.loadCharacterAndProgress(this.characterId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }
  }

  loadCharacterAndProgress(characterId: string): void {
    this.characterService.getCharacterProgress(characterId).subscribe({
      next: (data) => {
        this.campaignProgress = data.campaign_progress || {};
        this.completedWorlds = new Set(Object.keys(this.campaignProgress).filter(key => this.campaignProgress[key]));
      },
      error: (err) => {
        console.error('Falha ao carregar o progresso do personagem:', err);
      }
    });
  }

  isWorldCompleted(worldId: string): boolean {
    return this.completedWorlds.has(worldId);
  }

  isWorldUnlocked(worldId: string): boolean {
    if (worldId === 'nebula-primordial') {
      return true;
    }
    const dependencies = this.worldDependencies[worldId];
    if (!dependencies) {
      return false;
    }
    return dependencies.every(dependencyId => this.completedWorlds.has(dependencyId));
  }

  calculateProgress(): number {
    const totalPlayable = this.worlds.length;
    if (totalPlayable === 0) return 0;
    return (this.completedWorlds.size / totalPlayable) * 100;
  }

  selectWorld(worldId: string): void {
    if (this.isWorldUnlocked(worldId) && !this.isWorldCompleted(worldId)) {
      console.log(`Navegando para a batalha: Personagem ${this.characterId}, Mundo ${worldId}`);
      this.router.navigate(['/game/battle', this.characterId, worldId]);
    }
    else if (this.isWorldCompleted(worldId)) {
      console.log('Este mundo já foi concluído!');
    }
    else {
      console.log('Mundo bloqueado!');
    }
  }
}