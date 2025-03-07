import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../../components/washo/modal/modal.component';

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
  @Output() addressChanged = new EventEmitter<string>(); // emitimos una variable como evento

  map!: google.maps.Map;
  user: { lat: number; lon: number } = { lat: 19.432608, lon: -99.133209 };
  modalStatus: boolean = false;


  
  constructor(public modalController: ModalController) {}

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

    //  yoo
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

    // 4 marcadores aleatorios
    this.RandomLavadoras(9);
  }

  RandomLavadoras(count: number) {
    for (let i = 0; i < count; i++) {
      const { lat, lng } = this.generateRandomLavadoras(
        this.user.lat,
        this.user.lon
      );

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: `Marcador ${i + 1}`,
        icon: {
          url: 'assets/icon/icon-lava.png',
          scaledSize: new google.maps.Size(27, 27),
        },
      });
      
      marker.addListener('click', async () => {
        await this.abrirModal();
      });
    }
  }

  generateRandomLavadoras(
    lat: number,
    lon: number
  ): { lat: number; lng: number } {
    const earthRadius = 6371; // Radio de la Tierra en km
    const maxDistance = 1; // Distancia máxima en km (1000m)

    // Generar una distancia y ángulo aleatorio
    const randomDistance =
      (Math.random() * (maxDistance - 0.3) + 0.3) / earthRadius;
    const randomAngle = Math.random() * 2 * Math.PI;

    // Desplazamiento en latitud y longitud
    const newLat =
      lat + randomDistance * Math.cos(randomAngle) * (180 / Math.PI);
    const newLng =
      lon +
      (randomDistance * Math.sin(randomAngle) * (180 / Math.PI)) /
        Math.cos((lat * Math.PI) / 180);

    return { lat: newLat, lng: newLng };
  }

  getAddress(lat: number, lon: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng: lon };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const address = results[0].formatted_address;
        this.addressChanged.emit(address);
      } else {
        console.error('No se pudo obtener la dirección:', status);
      }
    });
  }

  async abrirModal() {
    const imagenes = [
      'assets/images/prueba1.jpg',
      'assets/images/prueba2.jpg',
      'assets/images/prueba3.jpg',
      'assets/images/prueba4.jpg',
      'assets/images/prueba5.jpg'
    ];
  
    const obtenerImagenAleatoria = () => imagenes[Math.floor(Math.random() * imagenes.length)];
  
    const lavanderias = [
      {
        "nombre": "Lavandería El Buen Lavado",
        "ubicacion": { "lat": 19.432608, "lng": -99.133209 },
        "calificacion": 4.5,
        "comentarios": [
          { "comentario": "Excelente servicio y ropa bien cuidada.", "usuario": "Carlos M." },
          { "comentario": "Rápidos y atentos, recomendados.", "usuario": "Ana P." },
          { "comentario": "El servicio es bueno pero el tiempo de entrega podría mejorar.", "usuario": "Luis G." },
          { "comentario": "Personal amable, pero la ropa no queda tan fresca como esperaba.", "usuario": "María T." }
        ],
        "fotografia": obtenerImagenAleatoria()
      },
      {
        "nombre": "Lavandería La Perla",
        "ubicacion": { "lat": 19.435670, "lng": -99.132000 },
        "calificacion": 3.8,
        "comentarios": [
          { "comentario": "El servicio es bueno pero el tiempo de entrega podría mejorar.", "usuario": "Luis G." },
          { "comentario": "Personal amable, pero la ropa no queda tan fresca como esperaba.", "usuario": "María T." },
          { "comentario": "Buen servicio y rápido, pero un poco caro.", "usuario": "Pedro H." },
          { "comentario": "Excelente servicio y ropa bien cuidada.", "usuario": "Carlos M." },
        ],
        "fotografia": obtenerImagenAleatoria()
      },
      {
        "nombre": "Limpieza Rápida",
        "ubicacion": { "lat": 19.430123, "lng": -99.135200 },
        "calificacion": 4.0,
        "comentarios": [
          { "comentario": "Buen servicio y rápido, pero un poco caro.", "usuario": "Pedro H." },
          { "comentario": "Excelente atención al cliente, pero las máquinas están algo antiguas.", "usuario": "Sara D." }
        ],
        "fotografia": obtenerImagenAleatoria()
      },
      {
        "nombre": "Lavado Express",
        "ubicacion": { "lat": 19.437200, "lng": -99.134500 },
        "calificacion": 4.2,
        "comentarios": [
          { "comentario": "Muy rápidos y económicos.", "usuario": "Jorge F." },
          { "comentario": "Buen servicio, pero podrían ofrecer más productos ecológicos.", "usuario": "Claudia N." }
        ],
        "fotografia": obtenerImagenAleatoria()
      },
      {
        "nombre": "Lavandería Lux",
        "ubicacion": { "lat": 19.438500, "lng": -99.136000 },
        "calificacion": 5.0,
        "comentarios": [
          { "comentario": "El mejor servicio en la zona. La ropa queda impecable.", "usuario": "Marcos J." },
          { "comentario": "Recomiendo 100%. Siempre puntual y muy amable.", "usuario": "Sofía L." }
        ],
        "fotografia": obtenerImagenAleatoria()
      },
      {
        "nombre": "Tu Lavado",
        "ubicacion": { "lat": 19.433900, "lng": -99.137000 },
        "calificacion": 3.5,
        "comentarios": [
          { "comentario": "No fue tan rápido como prometen, pero la calidad es buena.", "usuario": "Carlos V." },
          { "comentario": "El lugar está limpio, pero la atención podría mejorar.", "usuario": "Luz M." }
        ],
        "fotografia": obtenerImagenAleatoria()
      },
      {
        "nombre": "Lavandería El Sol",
        "ubicacion": { "lat": 19.439600, "lng": -99.138200 },
        "calificacion": 4.3,
        "comentarios": [
          { "comentario": "Muy buena calidad, pero me gustaría que tuviera más horarios.", "usuario": "Raúl P." },
          { "comentario": "El personal es muy amable, pero los precios un poco altos.", "usuario": "Gabriela S." }
        ],
        "fotografia": obtenerImagenAleatoria()
      },
      {
        "nombre": "Lavado Total",
        "ubicacion": { "lat": 19.431700, "lng": -99.139300 },
        "calificacion": 3.9,
        "comentarios": [
          { "comentario": "Buena opción para urgencias, pero el servicio no es siempre constante.", "usuario": "José L." },
          { "comentario": "La ropa está limpia, pero en ocasiones los pliegues no son perfectos.", "usuario": "Renata F." }
        ],
        "fotografia": obtenerImagenAleatoria()
      },
      {
        "nombre": "Lavandería Casa Blanca",
        "ubicacion": { "lat": 19.434800, "lng": -99.140500 },
        "calificacion": 4.7,
        "comentarios": [
          { "comentario": "Servicio rápido y eficiente, muy contento con el resultado.", "usuario": "Mónica R." },
          { "comentario": "Me encanta que usen productos ecológicos.", "usuario": "Daniela B." }
        ],
        "fotografia": obtenerImagenAleatoria()
      }
    ];
  
    // aleatoria del array
    const lavanderiaRandom = lavanderias[Math.floor(Math.random() * lavanderias.length)];
  
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        lavanderia: lavanderiaRandom 
      }
    });
    await modal.present();
  }
  
}
