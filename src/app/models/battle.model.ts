export interface DialogLine {
  speaker: string;
  text: string;
  paragraphs?: string[];
}

export interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  dropImage?: string;
}

export interface Battle {
  id: string;
  title: string;
  theme: string;
  enemy: Enemy;
}