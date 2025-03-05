import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryWashoPageRoutingModule } from './history-washo-routing.module';

import { HistoryWashoPage } from './history-washo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryWashoPageRoutingModule,
    HistoryWashoPage
  ],
  declarations: []
})
export class HistoryWashoPageModule {}
