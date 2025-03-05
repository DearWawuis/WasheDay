import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorarioPage } from './horario.page';
import { ScheduleModalModule } from '../../components/schedule-modal/schedule-modal.module';

const routes: Routes = [
  {
    path: '',
    component: HorarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ScheduleModalModule ],
  exports: [RouterModule],
})
export class HorarioPageRoutingModule {}
