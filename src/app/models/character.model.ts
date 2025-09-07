export interface Character {
  id: string;
  name: string;
  race: string;
  char_class: string;
  description: string;
  attributes: {
    strength: number;
    intelligence: number;
    charisma: number;
    dexterity: number;
    intuition: number;
  };
  race_icon: string;
  class_icon: string;
  user_id: string;
  
  level: number;
  expPercentage: number;
  power: string;
  defense: string;
  energy: string;
  status: string;
  avatar: string;
}