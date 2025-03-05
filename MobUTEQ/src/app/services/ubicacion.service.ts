import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private API_URL = 'https://mob-uteq-api.vercel.app/api'; // URL del backend

  constructor(private http: HttpClient) { }

  // Obtener ubicaciones
  getUbicaciones(id_usuario: number): Observable<any> {
    return this.http.get(`${this.API_URL}/mapa/ubicaciones?id_usuario=${id_usuario}`);
  }
}
