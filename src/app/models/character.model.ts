export interface Attributes {
  strength: number;
  intelligence: number;
  charisma: number;
  dexterity: number;
  intuition: number;
}

export interface Character {
  id: string;
  name: string;
  race: string;
  char_class: string;
  description: string;
  attributes: Attributes;
  race_icon: string;
  class_icon: string;
  user_id: string;

  level: number;
  experience: number;

  expPercentage?: number;
  campaign_progress: { [worldName: string]: boolean };
  inventory: string[];
}