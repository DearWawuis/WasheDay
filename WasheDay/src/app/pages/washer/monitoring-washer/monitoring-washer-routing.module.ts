import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitoringWasherPage } from './monitoring-washer.page';

const routes: Routes = [
  {
    path: '',
    component: MonitoringWasherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitoringWasherPageRoutingModule {}
