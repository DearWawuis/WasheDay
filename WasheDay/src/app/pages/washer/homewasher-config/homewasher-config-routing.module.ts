import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomewasherConfigPage } from './homewasher-config.page';

const routes: Routes = [
  {
    path: '',
    component: HomewasherConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomewasherConfigPageRoutingModule {}
