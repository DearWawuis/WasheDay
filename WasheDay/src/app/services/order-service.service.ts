import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

interface Order {
  _id: string;
  userWashoId: {
    _id: string;
    name: string;
    lname: string;
    email: string;
  };
  washerId: {
    _id: string;
    name: string;
  };
  serviceId: number;
  estimatedDeliveryDate: string;
  kg: number;
  payType: string;
  orderStripeId: string | null;
  status: string;
  detergents: string[];
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  serviceName: string;
  detergentsName: string[];
  total: number;
}
@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  constructor(
    private http: HttpClient
  ) { }
  getOrderServiceByWasherId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.api}/orderService/getByWasherId/${userId}`);
  }

  saveOrder(data: any): Observable<any> {
      return this.http.post(`${environment.api}/orderService`, data)
    }
}
