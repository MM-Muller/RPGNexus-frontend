export interface CampaignEvent {
  tipo: 'combate' | 'dialogo' | 'fim' | 'inicio';
  danoRecebido?: number;
  danoCausado?: number;
  expGanha?: number;
  vitoria?: boolean;
}

export interface CampaignResponse {
  narrativa: string;
  evento: CampaignEvent;
}

export interface SuggestionsResponse {
  suggestions: string[];
}