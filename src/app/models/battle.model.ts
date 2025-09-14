export interface DialogLine {
  speaker: string;
  text: string;
}

export interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
}

export interface Battle {
  id: string;
  title: string;
  theme: string; 
  enemy: Enemy;
}