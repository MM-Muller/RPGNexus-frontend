import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../../models/character.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = `${environment.apiUrl}/characters/`;

  constructor(private http: HttpClient) { }

  createCharacter(character: any): Observable<any> {
    return this.http.post(this.apiUrl, character);
  }

  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(this.apiUrl);
  }

  deleteCharacter(characterId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${characterId}`);
  }

  getCharacterProgress(characterId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${characterId}/progress`);
  }

  getCampaignHistory(campaignId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/historico/${campaignId}`);
  }

  deleteCampaignHistory(campaignId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/historico/${campaignId}`);
  }

  updateCharacterProgress(
    characterId: string,
    progress: { [worldName: string]: boolean }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}${characterId}/progress`, { progress });
  }

  addExperience(characterId: string, experiencePoints: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${characterId}/add-xp`, { experience_points: experiencePoints });
  }

  addItemToInventory(characterId: string, item: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${characterId}/inventory`, { item });
  }
}