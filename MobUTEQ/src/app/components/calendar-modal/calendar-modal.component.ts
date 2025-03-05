import { Component,EventEmitter, Input, OnInit, Output  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarService } from 'src/app/services/calendar.service';


@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
})
export class CalendarModalComponent implements OnInit{
  //Variables y eventos que envian desde el componente padre :home:
  @Input() date: string = '';
  @Input() userId: number = 0;
  @Output() eventAdded = new EventEmitter<any>();
  //Para guardar los respectivos eventos de la Universidad y del Usuario
  eventsUteq: any[] = [];
  eventsUser: any[] = [];
  isAddingEvent: boolean = false;
  //Objeto para almacenar los datos del nuevo evento
  newEvent: any = { 
    id: 0,
    id_usuario: this.userId, 
    nombre_evento: '', 
    descripcion: '', 
    fecha_inicio: this.date,
    fecha_fin: '' 
  };
  today: Date = new Date(); //Fecha actual
  maxDate: string; //Fecha maxima que se puede seleccionar en el formulario de agregar o editarevento
  isToastOpen = false;  //Controlar el toast 
  toastMessage: string = 'Mensaje del toast'; //Inicializar el mensaje del toast

  //Funcion paras mostrar el toast (recibe mensaje de: se agrego, mofifico o elimino)
  showToast(message:any) {
    this.toastMessage = message; 
    this.isToastOpen = true;
    
    // Cerrar el toast después de 5 seg
    setTimeout(() => {
      this.isToastOpen = false;
    }, 5000);
  }


  //Como la fecha es string 'YYYY-MM-DD' se tiene que convetir en objeto Date
  get parsedDate(): Date {
    const parsed = new Date(this.date);
    return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());;
  }

  //Obtener la fecha actualizada pero NORMALIZADA
  get normalizedToday(): Date {
    const today = new Date();
    return new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  }

  constructor(
    private modalController: ModalController,
    private calendarService: CalendarService,) { 
      const year = 2026;
      this.maxDate = `${year}-12-31`;
    }
    ngOnInit() {
      this.loadEvents(this.date);
    }
    loadEvents(date: string) {
      this.calendarService.getEventsByDate(date, this.userId).subscribe((data) => {
        //Al consumir el servicio se asigna valores
        this.eventsUteq = data.events_uteq;
        this.eventsUser = data.events_user;
        this.newEvent.fecha_inicio = this.date;
        this.newEvent.id_usuario = this.userId;
      }, (error) => {
        console.error('Error al cargar los eventos:', error);
      });
    }
  // Funcion para cerrar modal
  dismiss() {
    this.calendarService.CloseModal(); //Se llama la funcion de cierre, esto para poder actualizar los eventos en caso de que se haya agregado mas
    this.modalController.dismiss(); //Cerrar modal 
  }
  
  //Controlar el modo de edicion de los eventos del usuario
  editEventUser(userEvent: any) {
    userEvent.isEditing = true; 
  }
  
  //Guardar cambios realizados de un evento del usuario 
  saveEvent(userEvent: any) {
    userEvent.isEditing = false; // Cambia el estado parfa no editar
    this.calendarService.updateEvent(userEvent).subscribe(
      response => {
        this.showToast('Evento actualizado: '+userEvent.nombre_evento); //Mostrar toast
      },
      error => {
        console.error('Error al actualizar el evento:', error);
      }
    );
  }
 
  //Eliminar evento del usuario (no se requiere confirmar)
  deleteEventUser(eventId: number) {
    this.calendarService.deleteEvent(eventId).subscribe(
      response => {
        this.eventsUser = this.eventsUser.filter(event => event.id !== eventId); // Actualiza la lista de eventos
        this.showToast('Evento eliminado con éxito'); //Mostra toast
      },
      error => {
        console.error('Error al eliminar el evento:', error);
      }
    );
  }
 

  //Funcion para los eventos de la UTEQ, para los eventos que tienen border
  getBorder(relleno: number, colorText: string, color: string): string {
    if (relleno === 0) {
      return `3px solid ${color}`; 
    } else if (relleno === 1) {
      return `3px solid transparent`; 
    } else if (relleno === 3 || relleno === 4 || relleno === 5) {
      return `3px solid ${color}`; 
    }
    return 'none';
  }
  
 //Funcion para los eventos de la UTEQ, para los eventos que tienen fondo o relleno
  getBackgroundColor(relleno: number, colorText: string, color: string): string {
    if (relleno === 1) {
      return color; 
    } 
    return 'transparent';
  }

  //Agregar eventos propios del usuario
  addEvent() {
    if (this.newEvent.fecha_fin) {
      this.newEvent.fecha_fin = this.newEvent.fecha_fin.split('T')[0];
    }
    //Consumir servicio para agregar
    this.calendarService.addEvent(this.newEvent).subscribe(
      response => {
        this.eventsUser.push({ ...this.newEvent, isEditing: false }); //Se agrega a la lista de eventos
        this.eventAdded.emit(this.newEvent);
        this.cancelAdd(); //Llamar funcion de control de formulario
        this.showToast('Evento agregado con éxito'); //Mostrar toast
      },
      error => {
        console.error('Error al agregar evento:', error);
      }
    );
  }
  
  //Permite inhabilitar el formulario, y restarurar los datos del objeto newEvent
  cancelAdd() {
    this.isAddingEvent = false;
    this.newEvent = {
      id: 0,
      id_usuario: this.userId, 
      nombre_evento: '',
      descripcion: '',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
    };
  }

 // Cambiar el estado de isEditing a false
  cancelEdit(userEvent: any) {
    userEvent.isEditing = false; 
  }


}
