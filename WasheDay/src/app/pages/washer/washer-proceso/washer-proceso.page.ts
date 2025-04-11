import { Component, OnInit } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router} from '@angular/router';


import { AlertController,  AlertInput } from '@ionic/angular';



import { ToastController } from '@ionic/angular';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-washer-proceso',
  templateUrl: './washer-proceso.page.html',
  styleUrls: ['./washer-proceso.page.scss'],
  standalone: false,
})
export class WasherProcesoPage implements OnInit {
  ordersToReceive: any; 
  ordersInProgress: any;
  ordersInHistory: any;
  userId:string = '';
  statusToReceive = ['Creada', 'Aceptada', 'Cancelada', 'Cotizada', 'Pago efectivo', 'Pago tarjeta', 'Lavando', 'Secando', 'Finalizado', 'Entregado']

  selectedSegment: string = 'recibir';

  searchQuery: string = "";

  isModalOpen = false;


  todos_array: any[] = [];

  filteredItems: any[] = [];

  estados = ['Orden Creada', 'Lavando', 'Secando', 'Finalizado'];





  ocupados = [
    { 
      id: '101', 
      nombre: 'Servicio 101', 
      Washo: 'Mario Torres', 
      Hora: '09:00 AM', 
      Ubicacion: 'Av. Libertad 789', 
      FechaSolicitud: new Date().toISOString().split("T")[0],
      FechaEntrega: new Date().toISOString(), 
      Detergentes: ['Tide Free & Gentle', 'Ariel Detergente', 'Ecovor'], 
      Status: 'Pendiente por pagar o definir pago' ,
      estadoActual: 3,
      kg: 32,
      precio: 34,
      total: 450.0
    },
    { 
      id: '102', 
      nombre: 'Servicio 102', 
      Washo: 'Lucía Fernández', 
      Hora: '10:45 AM', 
      Ubicacion: 'Calle 8 No. 32', 
      FechaSolicitud: new Date().toISOString().split("T")[0],
      FechaEntrega: 'martes, 03 de marzo', 
      Detergentes: ['Tide Free & Gentle', 'Ariel Detergente', 'Ecovor'], 
      Status: 'Pago realizado',
      estadoActual: 0,
      kg: 32,
      precio: 34,
      total: 450.0

    }
  ];
  

  recibidos = [
    
      { id: '001', nombre: 'Pedido 001', Washo: 'Juan Pérez', Hora: '10:30 AM', Ubicacion: 'Av. Central 123' },
      { id: '002', nombre: 'Pedido 002', Washo: 'Ana López', Hora: '11:15 AM', Ubicacion: 'Calle Falsa 456' },
      { id: '003', nombre: 'Pedido 003', Washo: 'Carlos Díaz', Hora: '12:00 PM', Ubicacion: 'Plaza Principal' }
    
  ];

  historial : any[] = [];


  pedido_recibido: string = "";


  constructor(private alertController: AlertController, private toastController: ToastController,private orderServiceService: OrderServiceService,
    private generalService: GeneralService) { 

    this.todos_array = [...this.ocupados, ...this.recibidos,...this.historial];

    this.filteredItems = [...this.todos_array];


    console.log("Soy array de historial . . ", this.historial);

  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.getOrders(this.userId);

    console.log("Soy el historial de historia . . ajaj " +   this.historial);

  }
//Obtener las ordenes de servicio que tengan status Creada 
getOrders(userId: string) {
  this.orderServiceService.getOrderServiceByWasherId(userId).subscribe(
    (orders) => {
      this.ordersToReceive = orders.filter(order => order.status === 'Aceptada');
      this.ordersInProgress = orders.filter(order => 
        ['Cotizada', 'Pago efectivo', 'Pago tarjeta', 'Lavando', 'Secando', 'Finalizado'].includes(order.status)
      );
      this.ordersInHistory = orders.filter(order => order.status === 'Entregado');
      
    },
    (error) => {
      //No hay registros
      this.ordersToReceive = [];
      this.ordersInProgress = [];
      this.ordersInHistory = [];
    }
  );
}

//Obtener estados
getStatusNow(status: string): number {
  switch (status) {
    case 'Cotizada':
    case 'Pago efectivo':
    case 'Pago tarjeta':
      return 0;  
    case 'Lavando':
      return 1;  
    case 'Secando':
      return 2;  
    case 'Finalizado':
      return 3; 
    default:
      return 4;  
  }
}

  closeModal(){


    this.isModalOpen = false;

  }
  guardar_pedido(){

    console.log("Voy a guardar pedido . . ");

  }


  async recoger_pedido(pedido: any) {
    console.log("Soy tu pedido lokote ..", pedido);
  
    this.pedido_recibido = pedido._id;
  
    console.log("Soy id del pedido. . ", pedido._id);
    console.log("Soy cambios para washer-proceso");
  
    const alert = await this.alertController.create({
      header: 'Recibir ropa de washo',
      cssClass: 'custom-modal-size',
      inputs: [
        { name: 'orderId', type: 'text', placeholder: 'ID ORDER', value: pedido._id, disabled: true },
        { name: 'Washo', type: 'text', placeholder: 'Nombre Washo', value: pedido.userWashoId.name + ' ' + pedido.userWashoId.lname, disabled: true },
        { name: 'kg', type: 'number', placeholder: 'Kilo de ropa', value: '', id: 'kg-input' },
        { name: 'precio', type: 'number', placeholder: 'Precio por kilo', value: 34, id: 'precio-input', disabled: true },
        { name: 'total', type: 'number', placeholder: 'Total a pagar', value: '', id: 'total-input', disabled: true },
        { name: 'fecha_entrega', type: 'text', placeholder: 'Fecha de entrega', value: '' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', handler: () => { this.pedido_recibido = ""; } },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              // Validación de que el campo "kg" no esté vacío
              if (data.kg === '' || isNaN(data.kg) || data.kg <= 0) {
                this.mostrarToast('El campo "Kilo de ropa" no puede estar vacío o ser menor o igual a cero', 'danger');
                return false; // No proceder con el guardado si la validación falla
              }
  
              const newData = {
                orderId: pedido._id,
                estimatedDeliveryDate: data.fecha_entrega || new Date().toISOString(),
                status: "Cotizada",
                kg: data.kg,
                total: parseFloat((data.kg * 34).toFixed(2)),
              };
  
              console.log("Soy Pedido aceptado . . ", newData);
  
              this.saveOrder(newData, 'recibir');
  
              return true;
            } catch (error) {
              console.error("Error al aceptar pedidos:", error);
              this.mostrarToast("Error al aceptar pedido", "danger");
              return false;
            }
          },
        },
      ],
    });
  
    await alert.present();
  
    setTimeout(() => {
      const kgInput = document.querySelector('input#kg-input') as HTMLInputElement;
      const precioInput = document.querySelector('input#precio-input') as HTMLInputElement;
      const totalInput = document.querySelector('input#total-input') as HTMLInputElement;
  
      if (kgInput && precioInput && totalInput) {
        const actualizarTotal = () => {
          const kg = parseFloat(kgInput.value) || 0;
          const precio = parseFloat(precioInput.value) || 0;
          totalInput.value = (kg * precio).toFixed(2);
        };
  
        kgInput.addEventListener("input", actualizarTotal);
        precioInput.addEventListener("input", actualizarTotal);
      }
    }, 300);
  }
  
  
  // Función para recibir ropa
saveOrder(orderData: any, doing: string) {
  //Preparar los datos que se guardaran
  
  this.orderServiceService.saveOrder(orderData).subscribe(
    (response) => {
      if(doing == 'recibir'){
        this.generalService.showToast('ROPA RECIBIDA EN MI WASHER', 'success');
      }
      if(doing == 'status'){
        this.generalService.showToast('Se cambio status', 'success');
      }
      if(doing == 'entregar'){
        this.generalService.showToast('Ropa entregada', 'success');
      }
      
      this.getOrders(this.userId);
    },
    (error) => {
      this.generalService.showToast('Ocurrio un error', 'danger');
    }
  );
}
  

  buscar_pedidos(){

    const busqueda = this.searchQuery.toLowerCase().trim();

    this.filteredItems = this.todos_array.filter(item => {
      const nombre_washo = item.nombre.toLowerCase().includes(busqueda);
      const id_washo = item.id.toLowerCase().includes(busqueda);


      return nombre_washo || id_washo;


    })



  }

  cambiarEstado(order: any) {
    if (this.getStatusNow(order.status) < this.estados.length - 1) {
    this.saveOrder({orderId:order._id, status: this.estados[this.getStatusNow(order.status)+1]}, 'status')
    } 
    if (this.getStatusNow(order.status) +1 === this.estados.length) {
      this.finalizar_servicio(order);
    }
  }

  async finalizar_servicio(finalizar_ped : any){

    console.log("Soy Finalizar pedido", finalizar_ped);


    console.log("Soy id del pedido. . ", finalizar_ped._id);
    console.log("Soy cambios para washer-proceso");


    console.log(typeof finalizar_ped.total);

    let total_pedido = finalizar_ped.total;




  
    const alert = await this.alertController.create({
      header: 'Entrega',
      message: 'Si el pago es contra la entrega recuerda cobrar la cantidad de la orden',
      cssClass: 'custom-modal-size',

      inputs: [

        { name: 'Washo', type: 'text', placeholder: 'Nombre Washo', value: finalizar_ped.userWashoId.name +' '+finalizar_ped.userWashoId.lname, disabled: true },

        { name: 'Total', type: 'number', placeholder: 'Total', value: finalizar_ped.total, disabled: true},
        {
          name: 'ampm',
          type: 'text',
          placeholder: 'fecha',
          value: new Date().toISOString().split("T")[0],
          disabled: true
        },
    
       
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', handler: () => {} },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              const newData = {
                orderId: finalizar_ped._id,
                status: "Entregado",
                deliveryDate: new Date().toISOString(),
              };
              this.saveOrder(newData, 'entregar');
             /* console.log("Soy pedido ya ya ya finalizado . .", newData);

              this.historial.push(newData);


              const index = this.ocupados.findIndex(ocupados => ocupados.id === finalizar_ped.id );

              if (index !== -1) {
                this.ocupados.splice(index, 1);
              } else {
                console.log("Elemento no encontrado, no se eliminó nada.");
              }*/


              console.log("Soy array yo con su hijito", this.historial);



             


  
             // this.mostrarToast('PEDIDO FINZALIDO', "success");


              this.pedido_recibido = "";

              return true;
            } catch (error) {
              console.error("Error al aceptar pedidos:", error);
              this.mostrarToast("Error al aceptar pedido", "danger");
              return false;
            }
          },
        },
      ],
    });
  
    await alert.present();


  }
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4000,    
      position: 'top',    
      color: color,       
      animated: true,  
      icon: "checkmark-circle", 
      cssClass: "custom-toast", 
    });
    toast.present();
  }
  


}