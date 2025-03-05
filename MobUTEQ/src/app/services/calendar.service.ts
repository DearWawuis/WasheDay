import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private user: { nombre : string, id: number} | null = null;// Almacena la información del usuario
  private API_URL = 'https://mob-uteq-api.vercel.app/api/calendar';  // Cambia esto por el URL de tu backend
  //private API_URL = 'http://localhost:3000/api/calendar';  // Cambia esto por el URL de tu backend
  private modalClosedSource = new Subject<void>();
  modalClosed$ = this.modalClosedSource.asObservable();

  constructor(private http: HttpClient) { 
    // Inicializa el usuario desde el almacenamiento local, si existe
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }
  getEventsx(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // Obetener los eventos
  getEvents(userId : number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${userId}`);
  }

  getEventsByDate(date: string, userId: number) {
   
    return this.http.get<any>(`${this.API_URL}/Details/${date}/${userId}`);
  }

  addEvent(event: any): Observable<any> {
    return this.http.post(`${this.API_URL}/AddEvent/`, event);
  }

  updateEvent(event: any): Observable<any> {
    return this.http.put(`${this.API_URL}/UpdateEventById/`, event); // Ajusta la URL según tu API
  }
  
  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/DeleteEventById/${eventId}`); // Ajusta la URL según tu API
  }
  CloseModal(){
    this.modalClosedSource.next();
  }

}
