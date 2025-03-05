import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-materia-modal',
  templateUrl: './materia-modal.component.html',
  styleUrls: ['./materia-modal.component.scss'],
})
export class MateriaModalComponent {
  @Input() options: { text: string, value: number }[] = [];
  selectedMateria: number | null = null;
  parcial: number | null = null;
  calificacion: number | null = null;

  constructor(private modalController: ModalController) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  guardar() {
    if (this.selectedMateria && this.parcial != null && this.calificacion != null) {
      this.modalController.dismiss({
        selectedMateria: this.selectedMateria,
        parcial: this.parcial,
        calificacion: this.calificacion
      });
    } else {
      console.error('Todos los campos son necesarios');
    }
  }
}
