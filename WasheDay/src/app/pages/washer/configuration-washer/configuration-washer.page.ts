import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalProfileComponent } from "../../../components/washer/modal-profile/modal-profile.component";
import { ModalMapaComponent } from "../../../components/washer/modal-mapa/modal-mapa.component";
import { ModalScheduleComponent } from "../../../components/washer/modal-schedule/modal-schedule.component";
import { ModalServicesComponent } from "../../../components/washer/modal-services/modal-services.component";
import { ModalDetergentsComponent } from "../../../components/washer/modal-detergents/modal-detergents.component";
import { AuthService } from 'src/app/services/auth.service';
import { ProfileWasherService } from 'src/app/services/profile-washer.service';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-configuration-washer',
  templateUrl: './configuration-washer.page.html',
  styleUrls: ['./configuration-washer.page.scss'],
  standalone: false
})
export class ConfigurationWasherPage implements OnInit {
  washerProfile: any; 
  userId:string = '';
  status: boolean | undefined;
  constructor(
    private modalController: ModalController,
    private  profileWasherService: ProfileWasherService,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.getWasherProfile(this.userId);
  }

//Obtener los datos del perfil si existe  
getWasherProfile(userId: string) {
    this.profileWasherService.getWasherProfile(userId).subscribe(
      (profile) => {
        this.washerProfile = profile;
      },
      (error) => {
        console.error('Error al obtener el perfil del washer', error);
      }
    );
  }

//Cambiar de status de la lavanderia Abierto o Cerrado
onStatusChange(event: any) {
    if(!this.washerProfile?.washerProfile?._id) return;
    //Preparar los datos que se guardaran
    const profileData = {
      status: event.detail.checked ? 'Abierto' : 'Cerrado',
      washerId: this.washerProfile.washerProfile._id
    };

   //Consumir servicio para guardar el status
   this.profileWasherService.saveProfile(profileData).subscribe({
    next: (response) => {
      this.washerProfile.washerProfile.status = event.detail.checked ? 'Abierto' : 'Cerrado';
      if(event.detail.checked){
        this.generalService.showToast('En estado abierto.', 'success');
      }else{
        this.generalService.showToast('En estado cerrado.', 'success');
      }
      
    },
    error: (error) => {
      this.generalService.showToast('Error al cambiar status.', 'danger');
    }
  });
  }

//Abrir modal para definir o cambiar mi perfil de Washer 
async openModalProfile() {
 //Guardar los datos originales en caso de cerrar modal
  const originalProfileName = this.washerProfile?.washerProfile?.name;
  const originalProfilePhone = this.washerProfile?.washerProfile?.phone;
  const modal = await this.modalController.create({
    component: ModalProfileComponent,
    componentProps: {
      userId: this.userId,
      washerId: this.washerProfile?.washerProfile?._id,
      name: this.washerProfile?.washerProfile?.name,
      phone: this.washerProfile?.washerProfile?.phone,
    }
  });
  //Subscribirse al evento profileSaved de mi modal
  modal.onDidDismiss().then((result) => {
    if (result.data) {
      const updatedProfile = result.data;
      this.getWasherProfile(this.userId);
      // Actualiza los valores del perfil
      this.washerProfile.washerProfile.name = updatedProfile.name;
      this.washerProfile.washerProfile.phone = updatedProfile.phone;
      this.washerProfile.washerProfile._id = updatedProfile.washerId;
    }else{
      //Recuperar datos si se cerro mi modal
      this.washerProfile.washerProfile.name = originalProfileName;
      this.washerProfile.washerProfile.phone = originalProfilePhone;
    }
  });
  
  return await modal.present();
}  


//Abrir modal para definir o cambiar ubicacion
async openModal() {
  const modal = await this.modalController.create({
    component: ModalMapaComponent,
    componentProps: {
      userId: this.userId,
      washerId: this.washerProfile?.washerProfile?._id,
      address: this.washerProfile?.washerProfile?.address,
      latitude: this.washerProfile?.washerProfile?.latitude,
      longitude: this.washerProfile?.washerProfile?.longitude
    }
  });
  //Subscribirse al evento locationSaved de mi modal mapa
  modal.onDidDismiss().then((result) => {
    if (result.data) {
      const updatedLocation = result.data;
      this.getWasherProfile(this.userId);
      // Actualiza los valores del perfil
      this.washerProfile.washerProfile.address = updatedLocation.address;
      this.washerProfile.washerProfile.latitude = updatedLocation.latitude;
      this.washerProfile.washerProfile.longitude = updatedLocation.longitude;
      this.washerProfile.washerProfile._id = updatedLocation.washerId;
    }
  });
  
  return await modal.present();
}



//Abrir modal para definir o cambiar horario
async openModalSchedule() {
  if(!this.washerProfile?.washerProfile?._id){
    this.generalService.showToast('Primero configura los datos anteriores.', 'danger'); 
    return; 
  } 
  //Guardar los datos originales en caso de cerrar modal
  const originalSchedule = JSON.parse(JSON.stringify(this.washerProfile?.washerProfile?.openingHours));
  const modal = await this.modalController.create({
    component: ModalScheduleComponent,
    componentProps: {
      userId: this.userId,
      washerId: this.washerProfile?.washerProfile?._id,
      openingHours: this.washerProfile?.washerProfile?.openingHours
    }
  });
  //Subscribirse al evento locationSaved de mi modal mapa
  modal.onDidDismiss().then((result) => {
    if (result.data) {
      const updatedSchedule = result.data;
      this.getWasherProfile(this.userId);
      // Actualiza los valores del perfil
      this.washerProfile.washerProfile.openingHours = updatedSchedule.openingHours;
      this.washerProfile.washerProfile._id = updatedSchedule.washerId;
    }else{
      //Recuperar valores si se cerro mi modal
      this.washerProfile.washerProfile.openingHours = originalSchedule;
    }
  });
  
  return await modal.present();
}



//Abrir modal para definir o cambiar servicios
async openModalServices() {
  if(!this.washerProfile?.washerProfile?._id){
    this.generalService.showToast('Primero configura los datos anteriores.', 'danger'); 
    return; 
  } 
  //Guardar los datos originales en caso de cerrar modal
  const originalServices = JSON.parse(JSON.stringify(this.washerProfile?.washerProfile?.services));
  const modal = await this.modalController.create({
    component: ModalServicesComponent,
    componentProps: {
      userId: this.userId,
      washerId: this.washerProfile?.washerProfile?._id,
      services: this.washerProfile?.washerProfile?.services
    }
  });
  //Subscribirse al evento servicesSaved de mi modal
  modal.onDidDismiss().then((result) => {
    if (result.data) {
      const updatedServices = result.data;
      this.getWasherProfile(this.userId);
      // Actualiza los valores del perfil
      this.washerProfile.washerProfile.services = updatedServices.services;
      this.washerProfile.washerProfile._id = updatedServices.washerId;
    }else{
      //Recuperar valores si se cerro mi modal
      this.washerProfile.washerProfile.services = originalServices;
    }
  });
  
  return await modal.present();
}




//Abrir modal para definir o cambiar los detergentes
async openModalDetergents() {
  if(!this.washerProfile?.washerProfile?._id){
    this.generalService.showToast('Primero configura los datos anteriores.', 'danger'); 
    return; 
  } 
  //Guardar los datos originales en caso de cerrar modal
  const originalDetergents = JSON.parse(JSON.stringify(this.washerProfile?.washerProfile?.detergents));
  const modal = await this.modalController.create({
    component: ModalDetergentsComponent,
    componentProps: {
      userId: this.userId,
      washerId: this.washerProfile?.washerProfile?._id,
      detergents: this.washerProfile?.washerProfile?.detergents
    }
  });
  //Subscribirse al evento detergentsSaved de mi modal
  modal.onDidDismiss().then((result) => {
    if (result.data) {
      const updatedDetergents = result.data;
      this.getWasherProfile(this.userId);
      // Actualiza los valores del perfil
      this.washerProfile.washerProfile.detergents = updatedDetergents.detergents;
      this.washerProfile.washerProfile._id = updatedDetergents.washerId;
    }else{
      //Recuperar los valores si se cerro mi modal
      this.washerProfile.washerProfile.detergents = originalDetergents;
    }
  });
  
  return await modal.present();
}
}

