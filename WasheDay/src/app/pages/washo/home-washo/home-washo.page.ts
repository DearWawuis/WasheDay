import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapaComponent } from '../../../components/washo/mapa/mapa.component';

@Component({
  selector: 'app-home-washo',
  templateUrl: './home-washo.page.html',
  styleUrls: ['./home-washo.page.scss'],
  standalone: false,
})
export class HomeWashoPage implements OnInit {
  address: string = 'Obteniendo ubicación...';
  public isLargeScreen: boolean = false;

  @ViewChild(MapaComponent) mapaComponent!: MapaComponent;
  
  constructor(
    public modalController: ModalController
  ) {
    this.isLargeScreen = window.innerWidth >= 765;
  }

  // cambios tiempo real
  @HostListener('window:resize', ['$event'])
  updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 765;
  }

  ngOnInit() {
    this.updateScreenSize() 
  }

  updateAddress(newAddress: string) {
    this.address = newAddress;
  }

  handleRefresh(event: any) {
    this.mapaComponent.getLocation();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
