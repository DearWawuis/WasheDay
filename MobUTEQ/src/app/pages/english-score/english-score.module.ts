import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnglishScorePageRoutingModule } from './english-score-routing.module';

import { EnglishScorePage } from './english-score.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnglishScorePageRoutingModule
  ],
  declarations: [EnglishScorePage]
})
export class EnglishScorePageModule {}
