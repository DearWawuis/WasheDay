import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripeWashoPage } from './stripe-washo.page';

const routes: Routes = [
  {
    path: '',
    component: StripeWashoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripeWashoPageRoutingModule {}
