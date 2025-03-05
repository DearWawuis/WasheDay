import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuatrimestreService {
  private API_URL = 'https://mob-uteq-api.vercel.app/api'; // Url del backend
  //private API_URL = 'http://localhost:3000/api';  // Cambia esto por el URL de tu backend

  constructor(private http: HttpClient) { }

  // Obtener todos los cuatrimestres de un usuario
  getCuatrimestres(userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/cuatrimestre/${userId}`);
  }

  // Crear un nuevo cuatrimestre para un usuario
  createCuatrimestre(userId: number, nombre: string): Observable<any> {
    const cuatrimestreData = { id_usuario: userId, nombre };
    return this.http.post(`${this.API_URL}/cuatrimestre/${userId}`, cuatrimestreData);
  }

  // Obtener un cuatrimestre específico de un usuario
  getCuatrimestre(userId: number, cuatrimestreId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/cuatrimestre/${userId}/${cuatrimestreId}`);
  }

  // Eliminar un cuatrimestre específico de un usuario
  deleteCuatrimestre(userId: number, cuatrimestreId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/cuatrimestre/${userId}/${cuatrimestreId}`);
  }

  getMateriasByCuatrimestre(cuatrimestreNumber: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/cuatrimestre/materias/cuatri/${cuatrimestreNumber}`);
  }

  createMateria(materia: { id_cuatrimestre: number, nombre: string }) {
    return this.http.post(`${this.API_URL}/cuatrimestre/materias`, materia);
  }

  // Obtener calificaciones de un alumno específico
  getCalificacionesByAlumno(userId: number, cuatrimestreNumber: number): Observable<any> {
    return this.http.get(`${this.API_URL}/cuatrimestre/calific/materias/${userId}/${cuatrimestreNumber}`);
  }

  getTopUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/cuatrimestre/users/top3`);
  }

  calcularPromedioGeneral(calificacionesAgrupadas: any[]): number {
    const promedios = calificacionesAgrupadas.map(c => parseFloat(c.promedio || 0));
    if (promedios.length === 0) {
      return 0;
    }
    const sumaPromedios = promedios.reduce((sum, promedio) => sum + promedio, 0);
    return parseFloat((sumaPromedios / promedios.length).toFixed(2));
  }

  verificarCalificacionExistente(userId: number, cuatrimestreNumber: number, idMateria: number, parcial: string): Observable<boolean> {
    const params = { id_usuario: userId, numero_cuatrimestre: cuatrimestreNumber, id_materia: idMateria, parcial };
  
    return this.http.post<boolean>(`${this.API_URL}/cuatrimestre/calificaciones/verificar`, params);
  }  

  agruparCalificacionesPorMateria(calificaciones: any[]): any[] {
    const agrupadas: { [materia: string]: { parcial: number, calificacion: number, fecha: string }[] } = {};
  
    calificaciones.forEach((calificacion) => {
      const { materia, parcial, calificacion: nota, created_at } = calificacion;
  
      if (!agrupadas[materia]) {
        agrupadas[materia] = [];
      }
  
      // Validación de calificación como número válido
      const calificacionNumerica = parseFloat(nota);
      if (!isNaN(calificacionNumerica)) {
        agrupadas[materia].push({ parcial, calificacion: calificacionNumerica, fecha: created_at });
      }
    });
  
    return Object.keys(agrupadas).map(materia => {
      const parciales = agrupadas[materia];
      const sumaCalificaciones = parciales.reduce((sum, item) => sum + item.calificacion, 0);
      const promedio = parciales.length > 0 ? sumaCalificaciones / parciales.length : 0; // Manejo de casos sin parciales
  
      return {
        materia,
        parciales,
        promedio: parseFloat(promedio.toFixed(2)) // Aseguramos que el promedio sea número con 2 decimales
      };
    });
  }  

  // Crear una nueva calificación para una materia y parcial específicos
  createCalificacion(calificacionData: {
    id_materia: number,
    id_usuario: number,
    parcial: number,
    calificacion: number
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/cuatrimestre/materias/calific`, calificacionData);
  }
}
