import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeWashoPageRoutingModule } from './home-washo-routing.module';

// Importamos el tab-bar
import { TabBarComponent } from '../../../components/tab-bar/tab-bar.component';
// Importamos el modal
import { ModalComponent } from '../../../components/modal/modal.component';

import { HomeWashoPage } from './home-washo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeWashoPageRoutingModule,
    TabBarComponent,
    ModalComponent,
  ],
  declarations: [HomeWashoPage],
})
export class HomeWashoPageModule {}
