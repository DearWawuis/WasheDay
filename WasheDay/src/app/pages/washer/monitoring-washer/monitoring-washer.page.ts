import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Router} from '@angular/router';


@Component({
  selector: 'app-monitoring-washer',
  templateUrl: './monitoring-washer.page.html',
  styleUrls: ['./monitoring-washer.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MonitoringWasherPage implements OnInit {

  servicios = [
    {
      id: 56532,
      nombre: 'Josué Jiménez Gómez',
      fecha: '23-02-2025',
      hora: '01:00 pm',
      tipoEnvio: 'Recolección y entrega a domicilio'
    },
    {
      id: 56554,
      nombre: 'Karen Mendoza Pérez',
      fecha: '23-02-2025',
      hora: '02:00 pm',
      tipoEnvio: 'Recolección y entrega a domicilio'
    },
    {
      id: 56559,
      nombre: 'Jesus Gonzalez Leal',
      fecha: '23-10-2025',
      hora: '09:00 pm',
      tipoEnvio: 'Recolección y entrega a domicilio'
      
    },
    {
      id: 56560,
      nombre: 'Maria Berenice Garcia Guiterrez',
      fecha: '23-22-2025',
      hora: '10:00 pm',
      tipoEnvio: 'Recolección y entrega a domicilio'


    }

  ];


  constructor(private router: Router) { }

  ngOnInit() {
  }

  navpend(){

    this.router.navigate(['/washer-proceso']);



  }

}
