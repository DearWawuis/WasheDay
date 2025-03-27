import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeneralService } from '../../../services/general.service';
import { ProfileWasherService } from '../../../services/profile-washer.service'; 

@Component({
  selector: 'app-modal-detergents',
  templateUrl: './modal-detergents.component.html',
  styleUrls: ['./modal-detergents.component.scss'],
  standalone: false
})
export class ModalDetergentsComponent  implements OnInit {
//Datos recibidos 
@Input() userId: string = '';
@Input() washerId: string = '';
@Input() detergents: any;
@Output() detergentsSaved = new EventEmitter<any>();
newDetergent: string = ''; 

 constructor(
   private modalController: ModalController,
   private generalService: GeneralService,
   private profileWasherService: ProfileWasherService
 ) { }

 ngOnInit() {}

// Agregar un nuevo detergente
addDetergent() {
  if (this.newDetergent.trim()) {
    const newDetergentObj = {
      name: this.newDetergent.trim(),
      active: false
    };
    this.detergents.push(newDetergentObj); //Se agrega al array de objetos
    this.newDetergent = '';//colocar eb blanco el input
  }
}

// Eliminar un detergente
deleteDetergent(detergentToDelete:any) {
  const index = this.detergents.indexOf(detergentToDelete);
  if (index !== -1) {
    this.detergents.splice(index, 1); //Quitar de la lista de objetos
  }
}

//Guardar detergentes
saveDetergents() {
   //Preparar los datos que se guardaran
   const profileData = {
     detergents: this.detergents,
     washerId: this.washerId,
     userId: this.userId, 
   };

  //Consumir servicio para guardar la ubicacion
  this.profileWasherService.saveProfile(profileData).subscribe({
   next: (response) => {
     this.generalService.showToast('Detergentes guardado correctamente.', 'success');
     this.detergentsSaved.emit(profileData); //Emitir mis datos modificados al elemento padre
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
