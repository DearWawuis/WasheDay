import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScheduleModalComponent } from './schedule-modal.component'

@NgModule({
  declarations: [ScheduleModalComponent],
  imports: [
    CommonModule,
    FormsModule, 
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [ScheduleModalComponent] 
})
export class ScheduleModalModule {}