import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { CalendarModalModule } from '../../components/calendar-modal/calendar-modal.module'

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CalendarModalModule ],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
