import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishScorePage } from './english-score.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishScorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishScorePageRoutingModule {}
