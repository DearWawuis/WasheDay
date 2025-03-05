import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalificacionesPageRoutingModule } from './calificaciones-routing.module';

import { CalificacionesPage } from './calificaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalificacionesPageRoutingModule
  ],
  declarations: [CalificacionesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalificacionesPageModule {}
