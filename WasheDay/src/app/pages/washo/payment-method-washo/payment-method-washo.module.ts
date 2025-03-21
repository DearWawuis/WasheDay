import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodWashoPageRoutingModule } from './payment-method-washo-routing.module';

import { PaymentMethodWashoPage } from './payment-method-washo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodWashoPageRoutingModule
  ],
  declarations: [PaymentMethodWashoPage]
})
export class PaymentMethodWashoPageModule {}
