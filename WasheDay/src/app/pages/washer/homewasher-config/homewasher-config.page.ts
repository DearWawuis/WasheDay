import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homewasher-config',
  templateUrl: './homewasher-config.page.html',
  styleUrls: ['./homewasher-config.page.scss'],
  standalone: false
})
export class HomewasherConfigPage implements OnInit {

  modalAbierta = false;

  detergentes: string[] = ['Arcoiris', 'Ariel', 'Roma','DAWN ','Limpieza Verde'];

  nuevoDetergente = '';


  constructor() { }


  abrirModalDetergentes() {
    this.modalAbierta = true;
  }

  cerrarModal() {
    this.modalAbierta = false;
  }




 

  ngOnInit() {
  }

  agregarDetergente() {
    if (this.nuevoDetergente.trim()) {
      this.detergentes.push(this.nuevoDetergente);
      this.nuevoDetergente = '';
    }
  }
  

}
