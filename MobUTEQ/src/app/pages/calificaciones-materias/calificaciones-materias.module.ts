import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalificacionesMateriasPageRoutingModule } from './calificaciones-materias-routing.module';

import { CalificacionesMateriasPage } from './calificaciones-materias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalificacionesMateriasPageRoutingModule
  ],
  declarations: [CalificacionesMateriasPage]
})
export class CalificacionesMateriasPageModule {}
