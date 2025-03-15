import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WasherProcesoPage } from './washer-proceso.page';

const routes: Routes = [
  {
    path: '',
    component: WasherProcesoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WasherProcesoPageRoutingModule {}
