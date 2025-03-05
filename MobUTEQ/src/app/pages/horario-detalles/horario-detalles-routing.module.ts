import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorarioDetallesPage } from './horario-detalles.page';
import { ScheduleModalModule } from '../../components/schedule-modal/schedule-modal.module';

const routes: Routes = [
  {
    path: '',
    component: HorarioDetallesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ScheduleModalModule],
  exports: [RouterModule],
})
export class HorarioDetallesPageRoutingModule {}
