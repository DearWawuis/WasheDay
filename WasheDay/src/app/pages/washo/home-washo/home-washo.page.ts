import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home-washo',
  templateUrl: './home-washo.page.html',
  styleUrls: ['./home-washo.page.scss'],
  standalone: false,
})
export class HomeWashoPage implements OnInit {
  address: string = 'Obteniendo ubicación...';
  constructor(public modalController: ModalController) {}

  ngOnInit() {}
  
  updateAddress(newAddress: string) {
    this.address = newAddress;
  }
}
