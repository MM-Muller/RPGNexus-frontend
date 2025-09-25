import { DialogLine } from './battle.model';

export interface BattleState {
  character_id: string;
  battle_id: string;
  battle_theme: string;
  history: DialogLine[];
  player_health: number;
  enemy_health: number;
  last_updated: string;
}