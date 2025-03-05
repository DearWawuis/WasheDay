import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorarioMateriaPage } from './horario-materia.page';
import { ScheduleModalModule } from '../../components/schedule-modal/schedule-modal.module';

const routes: Routes = [
  {
    path: '',
    component: HorarioMateriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ScheduleModalModule],
  exports: [RouterModule],
})
export class HorarioMateriaPageRoutingModule {}
