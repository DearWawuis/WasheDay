import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeWashoPageRoutingModule } from './home-washo-routing.module';

// Importamos el mapa
import { MapaComponent } from '../../../components/washo/mapa/mapa.component';

import { HomeWashoPage } from './home-washo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeWashoPageRoutingModule,
    MapaComponent
  ],
  declarations: [HomeWashoPage],
})
export class HomeWashoPageModule {}
