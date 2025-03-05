import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeWasherPageRoutingModule } from './home-washer-routing.module';

import { HomeWasherPage } from './home-washer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeWasherPageRoutingModule,
    HomeWasherPage
  ],
  declarations: []
})
export class HomeWasherPageModule {}
