import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

interface OpeningHours {
  active: boolean;
  openingTime?: string;
  closingTime?: string;
}

interface Service {
  _id: number; 
  name: string; 
  active: boolean; 
}

interface Detergent {
  name: string; 
  active: boolean; 
}

interface WasherProfile {
  _id: string;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  userId: string;
  openingHours: {
    Lunes: OpeningHours;
    Martes: OpeningHours;
    Miércoles: OpeningHours;
    Jueves: OpeningHours;
    Viernes: OpeningHours;
    Sábado: OpeningHours;
    Domingo: OpeningHours;
  };
  services: Service[];
  detergents: Detergent[];
  status: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProfileWasherService {

  constructor(
    private http: HttpClient
  ) { }
  getWasherProfile(userId: string): Observable<WasherProfile> {
    return this.http.get<WasherProfile>(`${environment.api}/washers/profile/${userId}`);
  }

  saveProfile(data: any): Observable<any> {
      return this.http.post(`${environment.api}/washers/profile`, data)
    }
}

