import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonitoringWasherPageRoutingModule } from './monitoring-washer-routing.module';

import { MonitoringWasherPage } from './monitoring-washer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonitoringWasherPageRoutingModule,
    MonitoringWasherPage
  ],
  declarations: []
})
export class MonitoringWasherPageModule {}
