import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripeWashoPageRoutingModule } from './stripe-washo-routing.module';

import { StripeWashoPage } from './stripe-washo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StripeWashoPageRoutingModule
  ],
  declarations: [StripeWashoPage]
})
export class StripeWashoPageModule {}
