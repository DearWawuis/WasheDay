import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StripeRestService {
  constructor(private http: HttpClient) {
  }

  getOrderDetail(id: string): Observable<any> {
    return this.http.get(`${environment.api}/washos/pay/${id}`)
  }

  sendPayment(token: string, id: string): Promise<any> {
    return this.http.patch(`${environment.api}/washos/pay/${id}`,
      {
        token
      }).toPromise()
  }

  generateOrder(data: { name: string, amount: number }): Observable<any> {
    return this.http.post(`${environment.api}/washos/pay`, data)
  }

  confirmOrder(id:string): Promise<any> {
    return this.http.patch(`${environment.api}/washos/pay/confirm/${id}`, {}).toPromise()
  }
}
