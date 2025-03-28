import { Component, OnInit } from '@angular/core';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { GeneralService } from '../../../services/general.service';
@Component({
  selector: 'app-monitoring-washer',
  templateUrl: './monitoring-washer.page.html',
  styleUrls: ['./monitoring-washer.page.scss'],
  standalone: false,
})
export class MonitoringWasherPage implements OnInit {
  orders: any; 
  userId:string = '67e3b16ad08a04cfef644901';

  constructor(
    private orderServiceService: OrderServiceService,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
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
      console.error('Error al obtener ordenes', error);
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
}
