import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-webview-modal',
  templateUrl: './webview-modal.component.html',
  styleUrls: ['./webview-modal.component.scss'],
})
export class WebviewModalComponent  implements OnInit {
  @Input() url!: string; // Declara la propiedad como Input

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  ngAfterViewInit() {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.style.height = `${window.innerHeight * 0.8}px`; // Ajusta al 80% del alto de la pantalla
    }
  }
  
  closeModal() {
    this.modalController.dismiss();
  }
}
