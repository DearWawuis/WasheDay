import { Component, OnInit } from '@angular/core';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { GeneralService } from '../../../services/general.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-monitoring-washer',
  templateUrl: './monitoring-washer.page.html',
  styleUrls: ['./monitoring-washer.page.scss'],
  standalone: false,
})
export class MonitoringWasherPage implements OnInit {
  orders: any; 
  userId:string = '';

  constructor(
    private orderServiceService: OrderServiceService,
    private generalService: GeneralService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.getNewOrders(this.userId);
  }

  //Obtener las ordenes de servicio que tengan status Creada 
  getNewOrders(userId: string) {
  this.orderServiceService.getOrderServiceByWasherId(userId).subscribe(
    (orders) => {
      this.orders = orders.filter(order => order.status === 'Creada');
      console.log(this.orders)
    },
    (error) => {
      //No hay registros
      this.orders = [];
    }
  );
}

// Función para cambiar el estado de la orden
changeOrderStatus(orderId: string, status: string) {
  //Preparar los datos que se guardaran
  const orderData = {
    orderId: orderId,
    status: status
  };
  this.orderServiceService.saveOrder(orderData).subscribe(
    (response) => {
      if(status == 'Aceptada'){
        this.generalService.showToast('Order: '+orderId+' aceptada. ', 'success');
      }else{
        this.generalService.showToast('Order: '+orderId+' rechazada. ', 'danger');
      }
      
      this.getNewOrders(this.userId);
    },
    (error) => {
      console.error('Error al actualizar el estado de la orden', error);
    }
  );
}

goToProcess() {
  console.log('weee');
  this.router.navigate(['/washer-proceso']);
}
}
