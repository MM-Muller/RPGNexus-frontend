import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = `${environment.apiUrl}/campaign`;

  constructor(private http: HttpClient) { }

  startBattle(characterId: string, battleTheme: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/start_battle`, {
      character_id: characterId,
      battle_theme: battleTheme
    });
  }

  sendAction(characterId: string, battleTheme: string, action: string, history: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/action`, {
      character_id: characterId,
      battle_theme: battleTheme,
      action,
      history
    });
  }
}