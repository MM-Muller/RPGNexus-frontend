import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../core/services/character.service';

@Component({
  selector: 'app-worlds',
  templateUrl: './worlds.component.html',
  styleUrls: ['./worlds.component.scss'],
})
export class WorldsComponent implements OnInit {
  characterId: string | null = null;
  campaignProgress: { [worldName: string]: boolean } = {};
  
  worlds = [
    { name: 'Nebulosa Primordial', id: 'primordial-nebula', description: 'O berço da civilização estelar', position: { left: '15%', top: '30%' }, status: 'completed' },
    { name: 'Sistema Aurelion', id: 'aurelion-guardian', description: 'Lar dos Guardiões Dourados', position: { left: '35%', top: '25%' }, status: 'open' },
    { name: 'Vórtice Púrpura', id: 'purple-vortex', description: 'Portal para dimensões perdidas', position: { left: '50%', top: '40%' }, status: 'open' },
    { name: 'Constelação Azurite', id: 'azurite-constellation', description: 'Fortaleza dos Arquitetos', position: { left: '65%', top: '35%' }, status: 'open' },
    { name: 'Nexus Central', id: 'central-nexus', description: 'Encruzilhada dos mundos', position: { left: '40%', top: '50%' }, status: 'open' },
    { name: 'Galáxia Cristalina', id: 'crystal-galaxy', description: 'Reino dos Harmônicos', position: { left: '55%', top: '60%' }, status: 'open' },
    { name: 'Singularidade Omega', id: 'omega-singularity', description: '??? Bloqueado ???', position: { left: '80%', top: '55%' }, status: 'locked' },
    { name: 'Aglomerado Estelar', id: 'star-cluster', description: 'Berçário de novas estrelas', position: { left: '20%', top: '70%' }, status: 'open' },
  ];

  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    this.characterId = this.route.snapshot.paramMap.get('characterId');
    if (this.characterId) {
      this.characterService.getCharacterProgress(this.characterId).subscribe((data) => {
        this.campaignProgress = data.campaign_progress || {};
      });
    }
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