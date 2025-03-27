import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigurationWasherPage } from './configuration-washer.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationWasherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationWasherPageRoutingModule {}
