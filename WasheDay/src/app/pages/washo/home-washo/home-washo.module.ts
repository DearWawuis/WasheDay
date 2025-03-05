import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeWashoPageRoutingModule } from './home-washo-routing.module';

import { HomeWashoPage } from './home-washo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeWashoPageRoutingModule,
    HomeWashoPage
  ],
  declarations: []
})
export class HomeWashoPageModule {}
