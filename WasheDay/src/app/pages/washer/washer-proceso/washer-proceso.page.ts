import { Component, OnInit } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router} from '@angular/router';



@Component({
  selector: 'app-washer-proceso',
  templateUrl: './washer-proceso.page.html',
  styleUrls: ['./washer-proceso.page.scss'],
  standalone: false,
})
export class WasherProcesoPage implements OnInit {

  selectedSegment: string = 'recibir';


  



  ocupados = [
    { id: '101', nombre: 'Servicio 101', Washo: 'Mario Torres', Hora: '09:00 AM', Ubicacion: 'Av. Libertad 789' },
    { id: '102', nombre: 'Servicio 102', Washo: 'Lucía Fernández', Hora: '10:45 AM', Ubicacion: 'Calle 8 No. 32' }
  ];

  recibidos = [
    
      { id: '001', nombre: 'Pedido 001', Washo: 'Juan Pérez', Hora: '10:30 AM', Ubicacion: 'Av. Central 123' },
      { id: '002', nombre: 'Pedido 002', Washo: 'Ana López', Hora: '11:15 AM', Ubicacion: 'Calle Falsa 456' },
      { id: '003', nombre: 'Pedido 003', Washo: 'Carlos Díaz', Hora: '12:00 PM', Ubicacion: 'Plaza Principal' }
    
  ];

  historial = [
    { id: '201', nombre: 'Historial 201', Washo: 'Pedro Ramírez', Hora: '08:00 AM', Ubicacion: 'Zona Industrial' },
    { id: '202', nombre: 'Historial 202', Washo: 'Sofía Méndez', Hora: '07:30 AM', Ubicacion: 'Barrio Centro' }
  ];

  pedido_recibido: string = "";


  constructor() { }

  ngOnInit() {
  }


 


  recoger_pedido(pedido : any){


    console.log("soy tu pedido lokote ..", pedido);

    this.pedido_recibido = pedido.id;

    console.log("Soy id del pedido. . ", pedido.id);


    console.log("Soy id del pedido guardado .. ", this.pedido_recibido);



    
    
      setTimeout(() => {
        this.pedido_recibido = "";

      }, 5000);








  }

}
