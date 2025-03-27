import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeneralService } from '../../../services/general.service';
import { ProfileWasherService } from '../../../services/profile-washer.service'; 

@Component({
  selector: 'app-modal-services',
  templateUrl: './modal-services.component.html',
  styleUrls: ['./modal-services.component.scss'],
  standalone: false
})
export class ModalServicesComponent  implements OnInit {
 //Datos recibidos 
 @Input() userId: string = '';
 @Input() washerId: string = '';
 @Input() services: any;
 @Output() servicesSaved = new EventEmitter<any>();
  constructor(
    private modalController: ModalController,
    private generalService: GeneralService,
    private profileWasherService: ProfileWasherService
  ) { }

  ngOnInit() {}



  saveServices() {
  
    //Preparar los datos que se guardaran
    const profileData = {
      services: this.services,
      washerId: this.washerId,
      userId: this.userId, 
    };

   //Consumir servicio para guardar la ubicacion
   this.profileWasherService.saveProfile(profileData).subscribe({
    next: (response) => {
      this.generalService.showToast('Servicios guardado correctamente.', 'success');
      this.servicesSaved.emit(profileData); //Emitir mis datos modificados al elemento padre
      this.modalController.dismiss(profileData); //Cerrar y enviarlos
    },
    error: (error) => {
      this.generalService.showToast('Error al guardar servicios.', 'danger');
    }
  });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
