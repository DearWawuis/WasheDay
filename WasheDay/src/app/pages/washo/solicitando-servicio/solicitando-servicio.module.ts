import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitandoServicioPageRoutingModule } from './solicitando-servicio-routing.module';

import { SolicitandoServicioPage } from './solicitando-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitandoServicioPageRoutingModule
  ],
  declarations: [SolicitandoServicioPage]
})
export class SolicitandoServicioPageModule {}
