import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../../components/modal/modal.component';

declare var google: any;

@Component({
  selector: 'app-home-washo',
  templateUrl: './home-washo.page.html',
  styleUrls: ['./home-washo.page.scss'],
  standalone: false,
})
export class HomeWashoPage implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapElement!: ElementRef;
  map!: google.maps.Map;
  user: { lat: number; lon: number } = { lat: 19.432608, lon: -99.133209 };
  address: string = 'Obteniendo ubicación...';
  modalStatus: boolean = false;

  constructor(
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getLocation();
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  async getLocation(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissionStatus = await Geolocation.requestPermissions();
        if (permissionStatus.location === 'granted') {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
          });

          this.user.lat = position.coords.latitude;
          this.user.lon = position.coords.longitude;
          this.loadMap();
          this.getAddress(this.user.lat, this.user.lon);
        } else {
          console.error('Permisos de geolocalización denegados.');
        }
      } catch (error) {
        console.error('Error obteniendo la ubicación:', error);
      }
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.user.lat = position.coords.latitude;
            this.user.lon = position.coords.longitude;
            this.loadMap();
            this.getAddress(this.user.lat, this.user.lon);
          },
          (error) => {
            console.error('Error obteniendo ubicación:', error);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        console.error('Geolocalización no soportada.');
      }
    }
  }

  async loadMap() {
    if (!this.mapElement) {
      console.error('El elemento del mapa aún no está disponible.');
      return;
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: this.user.lat, lng: this.user.lon },
      zoom: 16,
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy',
    });

    const marker = new google.maps.Marker({
      position: { lat: this.user.lat, lng: this.user.lon },
      map: this.map,
      title: 'Tu ubicación',
      draggable: false,
    });

    marker.addListener('click', () => {
      // console.log('Marcador clickeado');
      this.abrirModal();
    });
  }

  getAddress(lat: number, lon: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng: lon };

    geocoder.geocode(
      { location: latlng },
      (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus
      ) => {
        if (status === 'OK' && results && results.length > 0) {
          this.address = results[0].formatted_address;
        } else {
          console.error('No se pudo obtener la dirección:', status);
          this.address = 'Dirección no encontrada';
        }
      }
    );
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalComponent
    });
    await modal.present();
  }
}
