import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { GeneralService } from '../../../services/general.service';
import { ProfileWasherService } from '../../../services/profile-washer.service'; 

@Component({
  selector: 'app-modal-mapa',
  templateUrl: './modal-mapa.component.html',
  styleUrls: ['./modal-mapa.component.scss'],
  standalone: false
})
export class ModalMapaComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapElement!: ElementRef;
  @Output() locationSaved = new EventEmitter<any>();
  //Datos recibidos 
  @Input() userId: string = '';
  @Input() washerId: string = '';
  @Input() address: string = '';
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;

  map!: google.maps.Map;
  user: { lat: number; lon: number } = { lat: 19.432608, lon: -99.133209 };
  modalStatus: boolean = false;
  selectedAddress: string = ''; // Variable para almacenar la dirección seleccionada
  selectedMarker: google.maps.Marker | null = null; // Mantener referencia al marcador seleccionado
  loading: boolean = false; // Variable para controlar el estado de carga
  

  constructor(
    private modalController: ModalController,
    private generalService: GeneralService,
    private profileWasherService: ProfileWasherService 
  ) { }

  ngOnInit() {
    this.getLocation();
  }
  async getLocation(): Promise<void> {
    this.loading = true;
    const apiKey = this.generalService.getApiUrl();

    await this.loadGoogleMapsScript(apiKey);

    if (Capacitor.isNativePlatform()) {
      try {
        const permissionStatus = await Geolocation.requestPermissions();
        if (permissionStatus.location === 'granted') {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
          });
          this.user.lat = this.latitude ? this.latitude : position.coords.latitude;
          this.user.lon = this.longitude ? this.longitude : position.coords.longitude;
          this.loadMap();
          this.getAddress(this.user.lat, this.user.lon);
        } else {
          this.generalService.showToast(
            'Permisos de geolocalización denegados.',
            'danger'
          );
          console.error('Permisos de geolocalización denegados.');
          this.loading = false;
        }
      } catch (error) {
        console.error('Error obteniendo la ubicación:', error);
        this.loading = false;
      }
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.user.lat = this.latitude ? this.latitude : position.coords.latitude;
            this.user.lon = this.longitude ? this.longitude : position.coords.longitude;
            this.loadMap();
            this.getAddress(this.user.lat, this.user.lon);
          },
          (error) => {
            this.generalService.showToast(
              'Permisos de geolocalización denegados.',
              'danger'
            );
            console.error('Error obteniendo ubicación:', error);
            this.loading = false;
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        console.error('Geolocalización no soportada.');
        this.loading = false;
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

    // Crear marcador en la ubicación inicial del usuario
    this.selectedMarker = new google.maps.Marker({
      position: { lat: this.user.lat, lng: this.user.lon },
      map: this.map,
      title: 'Tu ubicación',
      draggable: true, // Permitir que el usuario arrastre el marcador
      icon: {
        url: 'assets/images/icon-logo.png',
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    //Permitir hacer click y marcar el puntero de la ubicacion  
    google.maps.event.addListener(this.map, 'click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        if (this.selectedMarker) {
          this.selectedMarker.setPosition(event.latLng);
        }
        this.getAddress(lat, lng);
      }
    });
    // Evento de arrastre del marcador para actualizar la dirección 
    google.maps.event.addListener(this.selectedMarker, 'dragend', () => {
      if (this.selectedMarker) {
        const position = this.selectedMarker.getPosition();
        if (position) {
          this.getAddress(position.lat(), position.lng());
        }
      }
    });
  }

  // Cargar dinámicamente el script de Google Maps
  async loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker`;

      script.onload = () => resolve();
      script.onerror = (error) => reject('Error al cargar la API de Google Maps: ' + error);

      document.head.appendChild(script);
    });
  }

  getAddress(lat: number, lon: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng: lon };
    geocoder.geocode({ location: latlng }, (results, status) => {
      this.loading = false;
      if (status === 'OK' && results && results.length > 0) {
        const address = results[0].formatted_address;
        this.selectedAddress = address; // Guardamos la dirección seleccionada
      } else {
        console.error('No se pudo obtener la dirección:', status);
      }
    });
  }


//Guardar la ubicacion seleccionada
  saveLocation() {
    // Verificamos si hay una dirección seleccionada
    if (!this.selectedAddress) {
      this.generalService.showToast('Por favor, selecciona una dirección.', 'danger');
      return;
    }

    //Preparar los datos que se guardaran
    const profileData = {
      address: this.selectedAddress,
      latitude: this.selectedMarker?.getPosition()?.lat(),
      longitude: this.selectedMarker?.getPosition()?.lng(),
      washerId: this.washerId,
      userId: this.userId, 
    };

   //Consumir servicio para guardar la ubicacion
   this.profileWasherService.saveProfile(profileData).subscribe({
    next: (response) => {
      this.generalService.showToast('Ubicación guardado correctamente.', 'success');
      this.locationSaved.emit(profileData); //Emitir mis datos modificados al elemento padre
      this.modalController.dismiss(profileData); //Cerrar y enviarlos
    },
    error: (error) => {
      this.generalService.showToast('Error al guardar ubicación.', 'danger');
    }
  });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

