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


  constructor(private alertController: AlertController, private toastController: ToastController) { 

    this.todos_array = [...this.ocupados, ...this.recibidos,...this.historial];

    this.filteredItems = [...this.todos_array];


    console.log("Soy array de historial . . ", this.historial);




   



    



  }

  ngOnInit() {


    console.log("Soy el historial de historia . . ajaj " +   this.historial);

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
        { name: 'Washo', type: 'text', placeholder: 'Nombre Washo', value: pedido.Washo, disabled: true },
        /*
          Le agregue nadamas unos id para poder detectarlos en la funcion de de flecha que 
          esta bajo con el setTimeout
        */
        { name: 'kg', type: 'number', placeholder: 'Kilo de ropa', value: '' , id: 'kg-input' },
        { name: 'precio', type: 'number', placeholder: 'Precio por kilo', value: 34, id: 'precio-input' , disabled: true },
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
                nombre: pedido.nombre,
                Washo: pedido.Washo,
                Hora: data.hora || "00:00",
                Ubicacion: data.ubicacion || "Sin ubicación",
                FechaSolicitud: new Date().toISOString().split("T")[0],
                FechaEntrega: data.fecha_entrega || new Date().toISOString(),
                Detergentes: Array.isArray(data.detergentes) ? data.detergentes : [], 
                Status: data.estado_pago || "Pendiente",
                estadoActual: 0,
                kg: data.kg || 0,
                precio: 34,
                total: parseFloat((data.kg * 34).toFixed(2)),


              };
  
              console.log("Soy Pedido aceptado . . ", newData);


              
              this.ocupados.push(newData);
             
              const index = this.recibidos.findIndex(recibido => recibido.id === pedido.id);
              
              
              if (index !== -1) {
                this.recibidos.splice(index, 1);
              } else {
                console.log("Elemento no encontrado, no se eliminó nada.");
              }

  
              this.mostrarToast('ROPA RECIBIDA EN MI WASHER', "success");


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

  async finalizar_servicio(finalizar_ped : any){

    console.log("Soy Finalizar pedido", finalizar_ped);


    console.log("Soy id del pedido. . ", finalizar_ped.id);
    console.log("Soy cambios para washer-proceso");


    console.log(typeof finalizar_ped.total);

    let total_pedido = finalizar_ped.total;




  
    const alert = await this.alertController.create({
      header: 'Entrega',
      message: 'Si el pago es contra la entrega recuerda cobrar la cantidad de la orden',
      cssClass: 'custom-modal-size',

      inputs: [

        { name: 'Washo', type: 'text', placeholder: 'Nombre Washo', value: finalizar_ped.Washo, disabled: true },

        { name: 'comentarios', type: 'text', placeholder: 'Especificaciones pedido', value: '' },
        { name: 'hora', type: 'number', placeholder: 'Selecciona una hora en especifico', value: ''},
        {
          name: 'ampm',
          type: 'text',
          placeholder: 'Escribe AM o PM',
          value: 'PM'
        },
    
       
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', handler: () => {} },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              const newData = {
                id: finalizar_ped.id,
                nombre: finalizar_ped.nombre,
                Washo: finalizar_ped.Washo,
                Hora: data.hora || "00:00",
                Ubicacion: data.ubicacion || "Sin ubicación",
                FechaSolicitud: new Date().toISOString().split("T")[0],
                FechaEntrega: data.fecha_entrega || new Date().toISOString(),
                Detergentes: Array.isArray(data.detergentes) ? data.detergentes : [], 
                Status: data.estado_pago || "Pendiente",
                estadoActual: 0,
                kg: finalizar_ped.kg,
                precio: 34,
                total: total_pedido,
                comentarios : data.comentarios,
                hora: data.hora,
                ampm: data.ampm




              };

              console.log("Soy pedido ya ya ya finalizado . .", newData);

              this.historial.push(newData);


              const index = this.ocupados.findIndex(ocupados => ocupados.id === finalizar_ped.id );

              if (index !== -1) {
                this.ocupados.splice(index, 1);
              } else {
                console.log("Elemento no encontrado, no se eliminó nada.");
              }


              console.log("Soy array yo con su hijito", this.historial);



             


  
              this.mostrarToast('PEDIDO FINZALIDO', "success");


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