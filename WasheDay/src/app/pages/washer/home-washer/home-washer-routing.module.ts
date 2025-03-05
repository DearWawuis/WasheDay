import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeWasherPage } from './home-washer.page';

const routes: Routes = [
  {
    path: '',
    component: HomeWasherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeWasherPageRoutingModule {}
