export interface DialogLine {
  speaker: string;
  text: string;
}

export interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  // Adicionar outras metricas do inimigo
}

export interface Battle {
  id: string;
  title: string;
  dialog: DialogLine[];
  enemy: Enemy;
}