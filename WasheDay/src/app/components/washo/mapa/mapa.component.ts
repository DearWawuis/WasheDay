import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../../components/washo/modal/modal.component';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapaComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapElement!: ElementRef;
  @Output() addressChanged = new EventEmitter<string>();

  map!: google.maps.Map;
  user: { lat: number; lon: number } = { lat: 19.432608, lon: -99.133209 };
  modalStatus: boolean = false;

  // Definimos las lavanderías estáticas
  lavanderias = [
    {
      _id: 1,
      nombre: 'Lavandería El Buen Lavado',
      ubicacion: { lat: 20.653043, lng: -100.403132 },
      calificacion: 4.5,
      comentarios: [
        { comentario: 'Excelente servicio y ropa bien cuidada.', usuario: 'Carlos M.' },
        { comentario: 'Rápidos y atentos, recomendados.', usuario: 'Ana P.' },
      ],
      fotografia: 'assets/images/prueba1.jpg'
    },
    {
      _id: 2,
      nombre: 'Lavandería La Perla',
      ubicacion: { lat: 20.657120, lng:  -100.399854 },
      calificacion: 3.8,
      comentarios: [
        { comentario: 'El servicio es bueno pero el tiempo de entrega podría mejorar.', usuario: 'Luis G.' },
        { comentario: 'Personal amable, pero la ropa no queda tan fresca como esperaba.', usuario: 'María T.' },
      ],
      fotografia: 'assets/images/prueba2.jpg'
    },
    {
      _id: 3,
      nombre: 'Limpieza Rápida',
      ubicacion: { lat: 20.657100, lng: -100.405850 }, // ~500m SE
      calificacion: 4.0,
      comentarios: [
        { comentario: 'Buen servicio y rápido, pero un poco caro.', usuario: 'Pedro H.' },
        { comentario: 'Excelente atención al cliente, pero las máquinas están algo antiguas.', usuario: 'Sara D.' },
      ],
      fotografia: 'assets/images/prueba3.jpg'
    },
    {
      _id: 4,
      nombre: 'Lavandería Express',
      ubicacion: { lat: 20.655950, lng: -100.403980 }, // ~450m NO
      calificacion: 4.2,
      comentarios: [
        { comentario: 'Muy rápido el servicio, lo recomiendo.', usuario: 'Juan L.' },
        { comentario: 'Buen precio por el servicio que ofrecen.', usuario: 'Laura M.' },
      ],
      fotografia: 'assets/images/prueba4.jpg'
    },
    {
      _id: 5,
      nombre: 'Lavandería Moderna',
      ubicacion: { lat: 20.657300, lng: -100.403800 }, // ~500m NE
      calificacion: 4.7,
      comentarios: [
        { comentario: 'Las mejores máquinas de la zona.', usuario: 'Roberto S.' },
        { comentario: 'Siempre dejo mi ropa aquí, nunca me ha fallado.', usuario: 'Patricia V.' },
      ],
      fotografia: 'assets/images/prueba5.jpg'
    }
  ];

  constructor(
    public modalController: ModalController,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    this.getLocation();
  }

  async getLocation(): Promise<void> {
    const apiKey = this.generalService.getApiUrl();

    await this.loadGoogleMapsScript(apiKey);

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
          this.generalService.showToast(
            'Permisos de geolocalización denegados.',
            'danger'
          );
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
            this.generalService.showToast(
              'Permisos de geolocalización denegados.',
              'danger'
            );
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

    const mapOptions: google.maps.MapOptions = {
      center: { lat: this.user.lat, lng: this.user.lon },
      zoom: 15,
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy',
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Marcador del usuario
    new google.maps.Marker({
      position: { lat: this.user.lat, lng: this.user.lon },
      map: this.map,
      title: 'Tu ubicación',
      draggable: false,
      icon: {
        url: 'https://maps.gstatic.com/mapfiles/ms2/micons/man.png',
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    // Marcadores de lavanderías estáticas
    this.addLavanderiasMarkers();
  }

  async loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker`;

      script.onload = () => resolve();
      script.onerror = (error) => reject('Error al cargar la API de Google Maps: ' + error);

      document.head.appendChild(script);
    });
  }

  addLavanderiasMarkers() {
    this.lavanderias.forEach(lavanderia => {
      const marker = new google.maps.Marker({
        position: lavanderia.ubicacion,
        map: this.map,
        title: lavanderia.nombre,
        icon: {
          url: 'assets/icon/icon-lava.png',
          scaledSize: new google.maps.Size(27, 27),
        },
      });

      marker.addListener('click', async () => {
        await this.abrirModal(lavanderia);
      });
    });
  }

  getAddress(lat: number, lon: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng: lon };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const address = results[0].formatted_address;
        this.addressChanged.emit(address);
        this.generalService.changeAddress(address);
      } else {
        console.error('No se pudo obtener la dirección:', status);
      }
    });
  }

  async abrirModal(lavanderia: any) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        lavanderia: lavanderia,
      },
    });
    await modal.present();
  }
}
