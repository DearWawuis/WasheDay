import { Component, OnInit } from '@angular/core';


import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-homewasher-config',
  templateUrl: './homewasher-config.page.html',
  styleUrls: ['./homewasher-config.page.scss'],
  standalone: false
})
export class HomewasherConfigPage implements OnInit {

  modalAbierta = false;

  modalAbierta_servicio = false;

  modalUbicacion = false;



  detergentes: string[] = ['Arcoiris', 'Ariel', 'Roma','DAWN ','Limpieza Verde'];


  servicios: string[] = ['Servicio de lavado','Servicio de lavado express','Servicio a domicilio'];


  nuevoDetergente = '';


  constructor(private alertController: AlertController) { }


  abrirModalDetergentes() {
    this.modalAbierta = true;
  }

  abrirModalServicios(){
    this.modalAbierta_servicio = true;

  }

  cerrarModal() {
    this.modalAbierta = false;
  }

  cerrarModal_servicios(){

    this.modalAbierta_servicio = false;

  }


  aceptar_servicios(){

    this.showAlert("Datos modificados con exito", "success");

    location.reload();

  }

  async showAlert(header: string, message: string, reload: boolean = false) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (reload) {
              location.reload();
            }
          },
        },
      ],
    });
    await alert.present();
  }




 

  ngOnInit() {
  }

  agregarDetergente() {
    if (this.nuevoDetergente.trim()) {
      this.detergentes.push(this.nuevoDetergente);
      this.nuevoDetergente = '';
    }
  }


  abrir_ubicacion(){

    this.modalUbicacion = true;



  }

  cerrarModalUbicacion(){

    this.modalUbicacion = false;
    
  }


}
