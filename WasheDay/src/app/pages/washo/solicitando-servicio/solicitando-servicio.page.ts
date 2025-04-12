import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitando-servicio',
  templateUrl: './solicitando-servicio.page.html',
  styleUrls: ['./solicitando-servicio.page.scss'],
  standalone: false,
})
export class SolicitandoServicioPage {
  // Variables para selects
  selectedDay: number | null = null;
  selectedMonth: string | null = null;
  selectedHour: string | null = null;

  // Añade esta propiedad
  lavanderia: any = null;

  // Opciones para los selects
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  availableHours: string[] = [];
  selectedServiceOption: string = '';
  showModal: boolean = true;

  activeSteps: boolean[] = [true, false, false, false];
  currentStep: number = 1;
  private intervalId: any;

  constructor(private router: Router) {
    for (let hour = 8; hour <= 20; hour++) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      this.availableHours.push(`${displayHour}:00 ${period}`);
      this.availableHours.push(`${displayHour}:30 ${period}`);
    }
  }
  formValid(): boolean {
    return (
      !!this.selectedServiceOption &&
      !!this.selectedDay &&
      !!this.selectedMonth &&
      !!this.selectedHour
    );
  }

  acceptService() {
    if (!this.formValid()) return;
    this.loadLavanderia();
    const lavanderia = JSON.parse(
      localStorage.getItem('lavanderia_seleccionada') || 'null'
    );
    const formattedDate = this.getFormattedSelectedDate();
    const serviceData = {
      lavanderia: lavanderia,
      serviceOption: this.selectedServiceOption,
      date: formattedDate,
      time: this.selectedHour,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('serviceData', JSON.stringify(serviceData));
    this.showModal = false;
    const service = JSON.parse(localStorage.getItem('serviceData') || 'null');

    this.startStatusAnimation();

    console.log(service);
  }

  closeModal() {
    this.router.navigate(['/home-washo']);
  }

  getFormattedSelectedDate(): string {
    if (!this.selectedDay || !this.selectedMonth) return '';

    // Crear fecha formateada
    const dateStr = `${this.selectedDay} ${
      this.selectedMonth
    } ${new Date().getFullYear()}`;
    const dateObj = new Date(dateStr);

    // Formatear día de la semana
    const days = [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
    ];
    const dayName = days[dateObj.getDay()];

    // Formatear mes (asegurando minúscula después de la primera letra)
    const month = this.selectedMonth.toLowerCase();
    const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return `${dayName}, ${
      this.selectedDay
    } de ${formattedMonth} de ${new Date().getFullYear()} a las ${
      this.selectedHour
    }`;
  }

  // Nuevo método para cargar la lavandería
  loadLavanderia(): void {
    const lavanderiaData = localStorage.getItem('lavanderia_seleccionada');
    if (lavanderiaData) {
      try {
        this.lavanderia = JSON.parse(lavanderiaData);
      } catch (e) {
        console.error('Error al parsear datos de lavandería:', e);
        this.lavanderia = { nombre: 'No disponible' };
      }
    }
  }
  startStatusAnimation() {
    this.intervalId = setInterval(() => {
      if (this.currentStep < 4) {
        this.currentStep++;
        this.activeSteps[this.currentStep - 1] = true;

        if (this.currentStep === 4) {
          clearInterval(this.intervalId);
        }
      }
    }, 2000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  goToPayment() {
    this.router.navigate(['/payment-method-washo']);
  }
  getStepLabel(step: number): string {
    const labels = ['Orden creada', 'Lavando', 'Secando', 'Finalizado'];
    return labels[step - 1];
  }
}
