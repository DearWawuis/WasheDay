import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnglishScoreService {
  private user: { nombre : string, id: number} | null = null;// Almacena la información del usuario
  private API_URL = 'https://mob-uteq-api.vercel.app/api/english-score'; 
  //private modalClosedSource = new Subject<void>();
  //modalClosed$ = this.modalClosedSource.asObservable();

  constructor(private http: HttpClient) { 
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  getScoreByUser(userId: number): Observable<any>{
    return this.http.get(`${this.API_URL}/GetScoreByUser/${userId}`);
  }

  addScore(score: number, userId:number): Observable<any> {
    return this.http.post(`${this.API_URL}/AddScoreByUser/${userId}`, { score });
  }
  
  updateScore(scoreId: number, score: number): Observable<any> {
    return this.http.put(`${this.API_URL}/UpdateScoreById/${scoreId}`, { score });
  }

  deleteScore(scoreId: number) {
    return this.http.delete(`${this.API_URL}/DeleteScoreById/${scoreId}`);
  }
}
