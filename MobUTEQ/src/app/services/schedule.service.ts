import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private user: { nombre : string, id: number} | null = null;// Almacena la información del usuario
  private API_URL = 'https://mob-uteq-api.vercel.app/api/horario'; 
  private modalClosedSource = new Subject<void>();
  modalClosed$ = this.modalClosedSource.asObservable();

  constructor(private http: HttpClient) { 
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  getScheduleByDayAndUser(day: string, userId: number) {
    return this.http.get<any>(`${this.API_URL}/Details/${day}/${userId}`);
  }

  verifyCuatri(userId: number):Observable<any> {
    return this.http.get<any>(`${this.API_URL}/VerifyCuatri/${userId}`);
  }

  getClassNowAndNext(day: string, userId:number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/DetailsScheduleStatusNow/${day}/${userId}`);
  }
  sendScheduleData(data: any, userId:number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/AddSchedule/${userId}`, data);
  }

  updateSchedule(idSubject: number, data: any, userId:number) {
    return this.http.put(`${this.API_URL}/UpdateSchedule/${idSubject}/${userId}`, data);
  }

  getScheduleById(idSubject: number, userId:number): Observable<any> {
    return this.http.get(`${this.API_URL}/GetScheduleById/${idSubject}/${userId}`);
  }

  getSubjectByUser(user:number): Observable<any>{
    return this.http.get(`${this.API_URL}/GetSubjectByUser/${user}`);
  }

  deleteSubjectAndSchedule(idSubject: number, userId:number): Observable<any> {
    return this.http.delete(`${this.API_URL}/DeleteSubjectAndScheduleById/${idSubject}/${userId}`); 
  }

  getSubjectsAll(userId:number): Observable<any>{
    return this.http.get(`${this.API_URL}/GetSubjectAll/${userId}`);
  }

  

  CloseModal(){
    this.modalClosedSource.next();
  }
}

