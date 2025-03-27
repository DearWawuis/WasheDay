import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';
import { ProfileWasherService } from '../../../services/profile-washer.service'; 
@Component({
  selector: 'app-modal-schedule',
  templateUrl: './modal-schedule.component.html',
  styleUrls: ['./modal-schedule.component.scss'],
  standalone: false
})
export class ModalScheduleComponent  implements OnInit {
  //Datos recibidos 
    @Input() userId: string = '';
    @Input() washerId: string = '';
    @Input() openingHours: any;
    @Output() locationSaved = new EventEmitter<any>();
    daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    endTimes: any = {};

    constructor(
      private modalController: ModalController,
      private fb: FormBuilder,
      private generalService: GeneralService,
      private profileWasherService: ProfileWasherService 
    ) { }

  ngOnInit() {
    this.initializeEndTimes();
    this.updateEndTimesForExistingData();
  }

  // Inicializamos las opciones de las horas de cierre
  initializeEndTimes() {
    for (let day of this.daysOfWeek) {
      this.endTimes[day] = [];
    }
  }

   // Actualizar las horas de cierre disponibles dependiendo de la hora de apertura seleccionada
   updateEndTimes(day: string) {
    const openingTime = this.openingHours[day].openingTime;

    // Las horas de cierre deben ser mayores que la hora de apertura seleccionada
    if (openingTime) {
      const openingTimeIndex = this.timeToIndex(openingTime);
      this.endTimes[day] = this.getAvailableEndTimes(openingTimeIndex);
    } else {
      this.endTimes[day] = [];
    }
  }

  // Conviertir la hora a un índice para poder compararlas
  timeToIndex(time: string): number {
    const times = ["07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00"];
    return times.indexOf(time);
  }

  // Obtiene las horas de cierre posibles después de la hora de apertura
  getAvailableEndTimes(startIndex: number): string[] {
    const times = ["07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00"];
    return times.slice(startIndex + 1);
  }

  //ACTUALIZAR LAS HORAS DE CIERRE CUANDO YA EXISTEN HORAS ESTABLECIDAS
  updateEndTimesForExistingData() {
    for (let day of this.daysOfWeek) {
      if (this.openingHours[day] && this.openingHours[day].openingTime) {
        this.updateEndTimes(day);
      }
    }
  }

  //Guardar el horario de servicio
  saveSchedule() {
  
    //Preparar los datos que se guardaran
    const profileData = {
      openingHours: this.openingHours,
      washerId: this.washerId,
      userId: this.userId, 
    };

   //Consumir servicio para guardar la ubicacion
   this.profileWasherService.saveProfile(profileData).subscribe({
    next: (response) => {
      this.generalService.showToast('Horario guardado correctamente.', 'success');
      this.locationSaved.emit(profileData); //Emitir mis datos modificados al elemento padre
      this.modalController.dismiss(profileData); //Cerrar y enviarlos
    },
    error: (error) => {
      this.generalService.showToast('Error al guardar horario.', 'danger');
    }
  });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
