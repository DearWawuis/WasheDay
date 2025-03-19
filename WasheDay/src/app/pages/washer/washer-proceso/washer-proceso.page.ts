import { Component, OnInit } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router} from '@angular/router';


import { AlertController,  AlertInput } from '@ionic/angular';



import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-washer-proceso',
  templateUrl: './washer-proceso.page.html',
  styleUrls: ['./washer-proceso.page.scss'],
  standalone: false,
})
export class WasherProcesoPage implements OnInit {

  selectedSegment: string = 'recibir';

  searchQuery: string = "";

  isModalOpen = false;


  todos_array: any[] = [];

  filteredItems: any[] = [];


  pedidos_aceptados: any[] = [];






  



  ocupados = [
    { 
      id: '101', 
      nombre: 'Servicio 101', 
      Washo: 'Mario Torres', 
      Hora: '09:00 AM', 
      Ubicacion: 'Av. Libertad 789', 
      FechaSolicitud: 'lunes, 17 de febrero de 2025', 
      FechaEntrega: 'martes, 18 de febrero', 
      Detergentes: ['Tide Free & Gentle', 'Ariel Detergente', 'Ecovor'], 
      EstadoPago: 'Pendiente por pagar o definir pago' 
    },
    { 
      id: '102', 
      nombre: 'Servicio 102', 
      Washo: 'Lucía Fernández', 
      Hora: '10:45 AM', 
      Ubicacion: 'Calle 8 No. 32', 
      FechaSolicitud: 'Martes, 27 de enero de 2025', 
      FechaEntrega: 'martes, 03 de marzo', 
      Detergentes: ['Tide Free & Gentle', 'Ariel Detergente', 'Ecovor'], 
      EstadoPago: 'Pago realizado' 
    }
  ];
  

  recibidos = [
    
      { id: '001', kg: 12, nombre: 'Pedido 001', Washo: 'Juan Pérez', Hora: '10:30 AM', Ubicacion: 'Av. Central 123' },
      { id: '002', kg: 33, nombre: 'Pedido 002', Washo: 'Ana López', Hora: '11:15 AM', Ubicacion: 'Calle Falsa 456' },
      { id: '003', kg: 21, nombre: 'Pedido 003', Washo: 'Carlos Díaz', Hora: '12:00 PM', Ubicacion: 'Plaza Principal' }
    
  ];

  historial = [
    { id: '201', nombre: 'Historial 201', Washo: 'Pedro Ramírez', Hora: '08:00 AM', Ubicacion: 'Zona Industrial' },
    { id: '202', nombre: 'Historial 202', Washo: 'Sofía Méndez', Hora: '07:30 AM', Ubicacion: 'Barrio Centro' }
  ];

  pedido_recibido: string = "";


  constructor(private alertController: AlertController, private toastController: ToastController) { 

    this.todos_array = [...this.ocupados, ...this.recibidos,...this.historial];

    this.filteredItems = [...this.todos_array];


    console.log("Son pedidos ya aceptados recibidos . . ", this.pedidos_aceptados );



    



  }

  ngOnInit() {
  }


  closeModal(){


    this.isModalOpen = false;

  }
  guardar_pedido(){

    console.log("Voy a guardar pedido . . ");

  }


  async recoger_pedido(pedido: any) {
    console.log("Soy tu pedido lokote ..", pedido);
  
    this.pedido_recibido = pedido.id;
  
    console.log("Soy id del pedido. . ", pedido.id);
    console.log("Soy cambios para washer-proceso");
  
    const alert = await this.alertController.create({
      header: 'Recibir ropa de washo',
      cssClass: 'custom-modal-size',
      ///Aqui declaro los inputs de campos
      ///Pero el campo de id, washo y total los bloqueamos para que no se pueda editar
      inputs: [
        { name: 'id', type: 'text', placeholder: 'ID WASHO', value: pedido.id, disabled: true },
        { name: 'washo', type: 'text', placeholder: 'Nombre Washo', value: pedido.Washo, disabled: true },
        /*
          Le agregue nadamas unos id para poder detectarlos en la funcion de de flecha que 
          esta bajo con el setTimeout
        */
        { name: 'kg', type: 'number', placeholder: 'Kilo de ropa', value: pedido.kg , id: 'kg-input' },
        { name: 'precio', type: 'number', placeholder: 'Precio por kilo', value: '', id: 'precio-input' },
        { name: 'total', type: 'number', placeholder: 'Total a pagar', value: '', id: 'total-input', disabled: true },
        { name: 'fecha_entrega', type: 'text', placeholder: 'Fecha de entrega', value: '' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', handler: () => { this.pedido_recibido = ""; } },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              const newData = {
                id: pedido.id,
                washo: pedido.nombre,
                kg: data.kg,
                precio: data.precio,
                total: data.total,
                fecha_entrega: data.fecha_entrega
              };
  
              console.log("Soy Pedido aceptado . . ", newData);
              this.pedidos_aceptados.push(newData);
  
              this.mostrarToast(`ROPA RECIBIDA EN MI WASHER`, "success");


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

    /*

    Aqui se agrego el tiempo un setTimeout para que le tiempo
    de realizar la operacion de total que solo es una 
    multiplicacion de kg x precio

    */
    setTimeout(() => {

      /*
        Aqui detectamos los inpur que temos en la modal de input
        lo que son el precio y KG
        y tambien detectamos el input de total

      */
      const kgInput = document.querySelector('input#kg-input') as HTMLInputElement;
      const precioInput = document.querySelector('input#precio-input') as HTMLInputElement;
      const totalInput = document.querySelector('input#total-input') as HTMLInputElement;
  
      if (kgInput && precioInput && totalInput) {
        //Aqui solo validamos que el input no este vacio

        ///Adentro creamos una funcion de flecha para poder 
        /*
        REALIZAR LA MULTIPLICACION CORRESPONDIENTE

        */
        const actualizarTotal = () => {
          /*
            Aqui solo accedemos al input y obtenemos el value
            y despues hacemos la multiplicacion y lo actualiza al momento
          */
          const kg = parseFloat(kgInput.value) || 0;
          const precio = parseFloat(precioInput.value) || 0;
          totalInput.value = (kg * precio).toFixed(2);
        };
  
        
        /*
        Aqui nadamas le mandamos el actualizar a total con
        la funcion de actualizarTotal y se lo asiganmos al momento


        */
        kgInput.addEventListener("input", actualizarTotal);
        precioInput.addEventListener("input", actualizarTotal);
      }
    }, 300);
  }
  
  
  

  buscar_pedidos(){

    const busqueda = this.searchQuery.toLowerCase().trim();

    this.filteredItems = this.todos_array.filter(item => {
      const nombre_washo = item.nombre.toLowerCase().includes(busqueda);
      const id_washo = item.id.toLowerCase().includes(busqueda);


      return nombre_washo || id_washo;


    })



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
