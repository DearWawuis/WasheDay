import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryWashoPage } from './history-washo.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryWashoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryWashoPageRoutingModule {}
