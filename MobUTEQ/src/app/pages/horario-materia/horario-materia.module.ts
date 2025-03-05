import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorarioMateriaPageRoutingModule } from './horario-materia-routing.module';

import { HorarioMateriaPage } from './horario-materia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorarioMateriaPageRoutingModule
  ],
  declarations: [HorarioMateriaPage]
})
export class HorarioMateriaPageModule {}

