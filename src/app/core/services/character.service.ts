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

  constructor(private http: HttpClient) {}

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

  updateCharacterProgress(
    characterId: string,
    progress: { [worldName: string]: boolean }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}${characterId}/progress`, { progress });
  }
}