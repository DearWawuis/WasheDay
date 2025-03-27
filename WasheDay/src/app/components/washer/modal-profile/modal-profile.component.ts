import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';
import { ProfileWasherService } from '../../../services/profile-washer.service'; 

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.scss'],
  standalone: false
})
export class ModalProfileComponent  implements OnInit {
//Datos recibidos 
@Input() userId: string = '';
@Input() washerId: string = '';
@Input() name: string = '';
@Input() phone: string = '';
@Output() profileSaved = new EventEmitter<any>();
profileForm!: FormGroup;

 constructor(
   private modalController: ModalController,
   private generalService: GeneralService,
   private profileWasherService: ProfileWasherService,
   private fb: FormBuilder
 ) { }

 ngOnInit() {
  this.profileForm = this.fb.group({
    name: new FormControl(this.name, [Validators.required, Validators.minLength(3)]),
    phone: new FormControl(this.phone, [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ])
  });
 }


saveMyProfile() {
  //Validar formulario
  if (this.profileForm.invalid) {
    return; 
  }

   //Preparar los datos que se guardaran
   const profileData = {
     name: this.profileForm.value.name,
     phone: this.profileForm.value.phone,
     washerId: this.washerId,
     userId: this.userId, 
   };

  //Consumir servicio para guardar la ubicacion
  this.profileWasherService.saveProfile(profileData).subscribe({
   next: (response) => {
     this.generalService.showToast('Detergentes guardado correctamente.', 'success');
     this.profileSaved.emit(profileData); //Emitir mis datos modificados al elemento padre
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
