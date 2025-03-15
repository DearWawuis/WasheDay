import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WasherProcesoPageRoutingModule } from './washer-proceso-routing.module';

import { WasherProcesoPage } from './washer-proceso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WasherProcesoPageRoutingModule
  ],
  declarations: [WasherProcesoPage]
})
export class WasherProcesoPageModule {}
