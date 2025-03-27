import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigurationWasherPageRoutingModule } from './configuration-washer-routing.module';

import { ConfigurationWasherPage } from './configuration-washer.page';
import { ModalProfileComponent } from "../../../components/washer/modal-profile/modal-profile.component";
import { ModalMapaComponent } from "../../../components/washer/modal-mapa/modal-mapa.component";
import { ModalScheduleComponent } from "../../../components/washer/modal-schedule/modal-schedule.component";
import { ModalServicesComponent } from "../../../components/washer/modal-services/modal-services.component";
import { ModalDetergentsComponent } from "../../../components/washer/modal-detergents/modal-detergents.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ConfigurationWasherPageRoutingModule
  ],
  declarations: [
    ConfigurationWasherPage, 
    ModalProfileComponent,
    ModalMapaComponent, 
    ModalScheduleComponent, 
    ModalServicesComponent,
    ModalDetergentsComponent
   ]
})
export class ConfigurationWasherPageModule {}
