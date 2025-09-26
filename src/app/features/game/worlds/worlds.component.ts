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

  private queryParamsSubscription?: Subscription;
  private paramMapSubscription?: Subscription;

  worlds = [
    { name: 'Nebulosa Primordial', id: 'primordial-nebula', description: 'O berço da civilização estelar', position: { left: '15%', top: '30%' }, status: 'open' },
    { name: 'Sistema Aurelion', id: 'aurelion-guardian', description: 'Lar dos Guardiões Dourados', position: { left: '35%', top: '25%' }, status: 'open' },
    { name: 'Vórtice Púrpura', id: 'purple-vortex', description: 'Portal para dimensões perdidas', position: { left: '50%', top: '40%' }, status: 'open' },
    { name: 'Constelação Azurite', id: 'azurite-constellation', description: 'A fortaleza cristalina dos Arquitetos do Vazio', position: { left: '65%', top: '35%' }, status: 'open' },
    { name: 'Nexus Central', id: 'central-nexus', description: 'O ponto de convergência de todas as Correntes Harmônicas', position: { left: '40%', top: '50%' }, status: 'open' },
    { name: 'Galáxia Cristalina', id: 'crystal-galaxy', description: 'Um reino etéreo onde os Harmônicos residem como pura energia', position: { left: '55%', top: '60%' }, status: 'open' },
    { name: 'Aglomerado Estelar', id: 'star-cluster', description: 'Berçário de novas estrelas e lar de criaturas exóticas', position: { left: '20%', top: '70%' }, status: 'open' },
    { name: 'Singularidade Omega', id: 'omega-singularity', description: 'Um enigma cósmico de poder inimaginável', position: { left: '80%', top: '55%' }, status: 'locked' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService
  ) {}

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
      },
      error: (err) => {
        console.error('Falha ao carregar o progresso do personagem:', err);
      }
    });
  }
  
  isWorldCompleted(worldId: string): boolean {
    return this.campaignProgress[worldId] || false;
  }
  
  calculateProgress(): number {
    const completedCount = Object.values(this.campaignProgress).filter(status => status).length;
    const totalPlayable = this.worlds.filter(w => w.status !== 'locked').length;
    if (totalPlayable === 0) return 0;
    return (completedCount / totalPlayable) * 100;
  }
}