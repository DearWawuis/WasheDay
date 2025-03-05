import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarModalComponent } from './calendar-modal.component'

@NgModule({
  declarations: [CalendarModalComponent],
  imports: [
    CommonModule,
    FormsModule, 
    IonicModule 
  ],
  exports: [CalendarModalComponent] 
})
export class CalendarModalModule {}