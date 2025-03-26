import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomewasherConfigPageRoutingModule } from './homewasher-config-routing.module';

import { HomewasherConfigPage } from './homewasher-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomewasherConfigPageRoutingModule
  ],
  declarations: [HomewasherConfigPage]
})
export class HomewasherConfigPageModule {}
