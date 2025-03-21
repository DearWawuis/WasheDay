import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMethodWashoPage } from './payment-method-washo.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodWashoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodWashoPageRoutingModule {}
