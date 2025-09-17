export interface CampaignEvent {
  tipo: 'combate' | 'dialogo' | 'fim';
  danoRecebido?: number;
  danoCausado?: number;
  expGanha?: number;
  vitoria?: boolean;
}

export interface CampaignResponse {
  narrativa: string;
  evento: CampaignEvent;
}