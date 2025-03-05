import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorarioDetallesPageRoutingModule } from './horario-detalles-routing.module';

import { HorarioDetallesPage } from './horario-detalles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorarioDetallesPageRoutingModule
  ],
  declarations: [HorarioDetallesPage]
})
export class HorarioDetallesPageModule {}
