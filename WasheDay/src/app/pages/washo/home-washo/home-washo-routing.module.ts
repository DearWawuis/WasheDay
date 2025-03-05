import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeWashoPage } from './home-washo.page';

const routes: Routes = [
  {
    path: '',
    component: HomeWashoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeWashoPageRoutingModule {}
