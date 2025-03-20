import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tip-description-modal',
  templateUrl: './tip-description-modal.component.html',
  styleUrls: ['./tip-description-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TipDescriptionModalComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  tips: string[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Convertir la descripción en una lista de consejos (si es necesario)
    if (this.descripcion) {
      this.tips = this.descripcion
        .split('\n')
        .map((tip) => tip.trim())
        .filter((tip) => tip !== '');
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
