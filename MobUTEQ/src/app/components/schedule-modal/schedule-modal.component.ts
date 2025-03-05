import { Component,EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScheduleService } from 'src/app/services/schedule.service';
import { FormBuilder, FormGroup, NgForm  } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.scss'],
})
export class ScheduleModalComponent  implements OnInit  {
  @Input() bDsubject: string = ''; ////
  @Input() bDteacher: string = '';  ////
  @Input() existId: number = 0;
  @Input() userId: number = 0;
  @Output() scheduleUpdated: EventEmitter<any> = new EventEmitter();
  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  idSubject : number = this.existId;
  scheduleData: any = {};
  subject: string = '';
  teacher: string = '';
  subjects: any[] = []; 
  selectedSubject: any;
  availableEndTimes: string[] = [];
  selected: any = {};
  @ViewChild('form') form!: NgForm; 
  
   alertButtons: any = [] = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        
      },
    },
    {
      text: 'Aceptar',
      role: 'confirm',
      handler: () => {
        this.confirmDeleteSubjectAndSchedule();
      },
    },
  ];
  messageAlert: string = '';
  isToastOpen = false;  //Controlar el toast 
  toastMessage: string = 'Mensaje del toast'; //mensaje

  constructor(
    private modalController: ModalController,
    private scheduleService: ScheduleService,
    private alertController: AlertController
  ) {
    this.daysOfWeek.forEach(day => {
      this.scheduleData[day] = {
        id: 0,
        selected: false,
        building: '',
        classroom: '',
        startTime: '',
        endTime: ''
      };
    });
   }

  ngOnInit() {
    this.idSubject = this.existId;
    this.loadSubjects();
    if (this.idSubject > 0) {//cuando se edita
      console.log('carga');
      this.loadScheduleData();
    }
  }
  loadSubjects() {
    this.scheduleService.getSubjectsAll(this.userId).subscribe(
      (data) => {
        this.subjects = data.results;
      }
    );
  }

  loadScheduleData() {
    this.scheduleService.getScheduleById(this.existId, this.userId).subscribe(
      (data) => {
        this.subject = data.subject;
        this.teacher = data.teacher;
        
        // Asignamos los horarios al objeto scheduleData por cada día
        for (let day of this.daysOfWeek) {
          this.scheduleData[day] = { 
            ...this.scheduleData[day], 
            ...data.schedule[day] 
          };
          if(this.scheduleData[day].selected){
           this.updateEndTimes(day)
          }
        }
      },
      (error) => {
        console.error('Error al cargar los datos de la materia:', error);
      }
    );
  }
  
  submitForm() {
    if (this.form.valid) {
      // Si el formulario es válido, podemos enviarlo
      this.sendData();
    } else {
      // Si el formulario no es válido, muestra un mensaje o maneja el error
      console.log('Formulario no válido');
    }
  }

  sendData() {
    const dataToSend = {
      subject: this.idSubject,
      teacher: this.teacher,
      schedule: this.scheduleData
    };

    if (this.idSubject > 0) {
      //solicitud para actualizar
      this.scheduleService.updateSchedule(this.idSubject, dataToSend, this.userId).subscribe(
        (response) => {
          this.dismiss();
          if(this.existId > 0){ //Actualizacion
            this.showToast('Se actualizó el horario con éxito.'); //Mostra toast
          }else{
            this.showToast('Se añadió el horario con éxito.'); //Mostra toast
          }
          this.dismiss();
        },
        (error) => {
          //console.error('Error al actualizar:', error);
        }
      );
    } else { 
      // Para crear uno nuevo
      this.scheduleService.sendScheduleData(dataToSend, this.userId).subscribe(
        (response) => {
          this.dismiss();
        },
        (error) => {
          //console.error('Error:', error);
        }
      );
    }
  }
  async presentAlert(messageAlert: string, action: string) {
    const alert = await this.alertController.create({
      header: messageAlert,
      buttons: this.alertButtons,
    });
  
    await alert.present();
  }
  setResult(ev:any) {
    
  }


  deleteSubjectAndSchedules() {
    this.presentAlert('¿Estás seguro de que deseas eliminar esta materia y su horario?', 'delete');
  }
  confirmDeleteSubjectAndSchedule(){
  this.scheduleService.deleteSubjectAndSchedule(this.idSubject, this.userId).subscribe(
    response => {
      this.showToast('Materia y horario eliminado con éxito'); //Mostra toast
      this.dismiss();
    },
    error => {
      console.error('Error al eliminar el mat y horario:', error);
    }
  )
  }

  showToast(message:any) {
    this.toastMessage = message; 
    this.isToastOpen = true;
    
    // Cerrar el toast después de 5 seg
    setTimeout(() => {
      this.isToastOpen = false;
    }, 5000);
  }



  updateEndTimes(day: string) {
    const startTime = this.scheduleData[day].startTime;
    if (startTime) {
      // Filtrar las horas que son mayores a la hora seleccionada (startTime)
      const hours = [
        "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00",
        "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00",
        "19:00:00", "20:00:00", "21:00:00", "22:00:00"
      ];
      
      // Convertir el startTime a un valor comparable y filtrar las horas mayores
      this.selected[day] = hours.filter(hour => this.compareTimes(hour, startTime));
    }
  }

  compareTimes(hour1: string, hour2: string): boolean {
    return hour1 > hour2;
  }

  // Funcion para cerrar modal
  dismiss() {
    this.scheduleService.CloseModal();
    this.modalController.dismiss(); //Cerrar modal 
  }

}


