import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router'; //

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalComponent implements OnInit {
  @Input() lavanderia: any;

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  solicitar_servicio() {
    if (this.lavanderia) {
      localStorage.setItem(
        'lavanderia_seleccionada',
        JSON.stringify(this.lavanderia)
      );
      this.cerrarModal();
      this.router.navigate(['/solicitando-servicio']);
    }
  }
}
