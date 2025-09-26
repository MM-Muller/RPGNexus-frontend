import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CampaignResponse, SuggestionsResponse } from 'src/app/models/campaign.model';
import { BattleState } from 'src/app/models/battle-state.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = `${environment.apiUrl}/campaign`;
  private wsUrl = `ws://localhost:8000/api/v1/campaign`;
  private socket?: WebSocket;
  private messageSubject = new Subject<any>();
  private wsConnectedSubject = new BehaviorSubject<boolean>(false);

  wsConnected$ = this.wsConnectedSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  connect(characterId: string, battleId: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      return new Observable(observer => observer.error('Token de autenticação não encontrado.'));
    }

    this.socket = new WebSocket(`${this.wsUrl}/ws/battle/${characterId}/${battleId}?token=${token}`);

    this.socket.onopen = () => {
      this.wsConnectedSubject.next(true);
      console.log('WebSocket connection opened.');
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageSubject.next(message);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      this.wsConnectedSubject.next(false);
      this.messageSubject.complete();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.wsConnectedSubject.next(false);
      this.messageSubject.error(error);
    };

    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.wsConnectedSubject.next(false);
    }
  }

  sendMessage(type: string, payload: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  exitBattle(state: BattleState): void {
    if (this.socket) {
      this.sendMessage('exit_battle', state);
      this.socket.close();
    }
  }

  getActionSuggestions(characterId: string, battleTheme: string, history: string[]): Observable<SuggestionsResponse> {
    return this.http.post<SuggestionsResponse>(`${this.apiUrl}/suggestions`, {
      character_id: characterId,
      battle_theme: battleTheme,
      history
    });
  }

  getMostRecentBattleState(characterId: string): Observable<BattleState> {
    return this.http.get<BattleState>(`${this.apiUrl}/most-recent-state/${characterId}`);
  }
}