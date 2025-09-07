import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../../models/character.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'http://localhost:8000/api/v1/characters';

  constructor(private http: HttpClient) {}

  createCharacter(character: any): Observable<any> {
    return this.http.post(this.apiUrl, character);
  }

  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(this.apiUrl);
  }

  deleteCharacter(characterId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${characterId}`);
  }
}