import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router'; // Importa Router para redireccionar
import { Subscription } from 'rxjs';
import { TabService } from '../../services/tab.service';
import { UbicacionService } from '../../services/ubicacion.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  isProfileMenuOpen: boolean = false; // Controlar si el menú está abierto o cerrado
  isLoggedIn: boolean = false; // Controlar si el usuario está autenticado
  userName: string = ''; // Variable para almacenar el nombre del usuario
  private routerSubscription!: Subscription; // Suscripción a eventos de navegación
  ubicaciones: any[] = [];
  map: any;
  marcadores: L.Marker[] = []; // Almacena los marcadores

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para redireccionar
    public tabService: TabService,
    private ubicacionService: UbicacionService,
  ) {
    // Inicializar el nombre del usuario y el estado de autenticación
    this.userName = this.authService.getUserName(); // Método para obtener el nombre del usuario
    this.isLoggedIn = !!this.userName; // Comprobar si el usuario está autenticado
  }

  ngOnInit() {
    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeProfileMenu(); // Cerrar el menú al cambiar de página
      }
    });
    this.cargarUbicaciones(); // Llamar para cargar ubicaciones al iniciar
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  cargarUbicaciones() {
    const id_usuario: number | 0 = this.authService.getUserId(); // Obtiene el id_usuario

    if (id_usuario) { // Verifica que id_usuario no sea null
      this.ubicacionService.getUbicaciones(id_usuario).subscribe({
        next: (ubicaciones) => {
          this.ubicaciones = ubicaciones;
          this.mostrarUbicacionesEnMapa();
          this.mostrarUbicacionesEnTabla();
        },
        error: (error) => {
          console.error('Error al cargar ubicaciones:', error);
        },
      });
    } else {
      console.error('ID de usuario no disponible. No se pueden cargar ubicaciones.');
    }
  }

  mostrarUbicacionesEnMapa() {
    if (!this.map) {
      // Inicializar el mapa centrado en una ubicación
      this.map = L.map('map').setView([20.655965079665478, -100.40497321360847], 17);

      // Crear capas de mapa de calles y de relieve usando Mapbox
      const streets = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia29oYWt1dG9ueSIsImEiOiJjbTJ3OTJ6dHAwNGRxMmtwdzJpbGgxbTdpIn0.Zms7JE5cAxtk70RY9Llkmw`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1
      });

      const outdoors = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia29oYWt1dG9ueSIsImEiOiJjbTJ3OTJ6dHAwNGRxMmtwdzJpbGgxbTdpIn0.Zms7JE5cAxtk70RY9Llkmw`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1
      });

      // Agregar una capa inicial (por ejemplo, "streets")
      streets.addTo(this.map);

      // Configurar el control de capas para alternar entre estilos
      const baseLayers = {
        "Streets": streets,
        "Outdoors (Relieve)": outdoors
      };

      L.control.layers(baseLayers).addTo(this.map);
    }

    // Limpiar los marcadores anteriores
    this.marcadores.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.marcadores = []; // Reiniciar el array de marcadores

    // Agregar marcadores de ubicaciones
    this.ubicaciones.forEach((ubicacion) => {
      const marker = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
        background-color: #fff; 
        color: #000; 
        padding: 5px; 
        border-radius: 5px; 
        text-align: center;
        border: 2px solid #000;
        font-weight: bold;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
        max-width: 50px;">${ubicacion.nombre}</div>`,
        iconSize: [100, 40],
        iconAnchor: [50, 20]
      });

      const markerInstance = L.marker([ubicacion.latitud, ubicacion.longitud], { icon: marker }).addTo(this.map)
        .bindPopup(`<b>${ubicacion.nombre}</b><br>${ubicacion.descripcion}`);

      if (ubicacion.visible) {
        markerInstance.addTo(this.map);
      }

      ubicacion.marker = markerInstance;
      this.marcadores.push(markerInstance);
    });
  }

  // Método para centrar el mapa en la ubicación seleccionada
  centrarEnUbicacion(ubicacion: any) {
    this.map.setView([ubicacion.latitud, ubicacion.longitud], 20); // Centrar el mapa en la ubicación
  }

  mostrarUbicacionesEnTabla() {
    const ubicacionesBody = document.getElementById('ubicaciones-body');
    if (ubicacionesBody) {
      // Limpiar el contenido anterior
      ubicacionesBody.innerHTML = '';

      // Llenar la tabla con las ubicaciones
      this.ubicaciones.forEach((ubicacion, index) => {
        ubicacion.visible = true;
        const row = document.createElement('tr');

        // Aplicar estilo directamente según si la fila es par o impar
        if (index % 2 === 0) {
          row.style.backgroundColor = '#f8f9fa'; // Fondo gris claro para filas pares
        } else {
          row.style.backgroundColor = '#e2e6ea'; // Fondo gris no tan oscuro para filas impares
        }
        row.style.color = 'black'; // Color negro para el texto

        const nombreCell = document.createElement('td');
        const descripcionCell = document.createElement('td');
        const mostrarCell = document.createElement('td');

        // Establecer padding en las celdas
        nombreCell.style.padding = '5px'; // Padding en la celda del nombre
        descripcionCell.style.padding = '5px'; // Padding en la celda de la descripción

        // Establecer el contenido de las celdas
        nombreCell.textContent = ubicacion.nombre;
        descripcionCell.textContent = ubicacion.descripcion;

        // Crear botón de mostrar/ocultar
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('toggle-button', 'toggle-individual');
        toggleButton.style.background = 'none';
        toggleButton.style.border = 'none';
        toggleButton.style.color = 'black'
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.width = '70px'; // Ajusta el ancho según sea necesario
        toggleButton.style.height = '40px'; // Ajusta el alto según sea necesario
        toggleButton.innerHTML = `<ion-icon name="eye-outline" style="font-size: 20px;"></ion-icon>`; // Icono de ojo abierto inicialmente
        toggleButton.onclick = () => {
          this.toggleMarkerVisibility(ubicacion, toggleButton);
        };

        // Agregar evento para centrar en la ubicación al hacer clic en la celda
        nombreCell.onclick = () => {
          this.centrarEnUbicacion(ubicacion);
        };
        descripcionCell.onclick = () => {
          this.centrarEnUbicacion(ubicacion);
        };

        // Añadir celdas y botón a la fila
        mostrarCell.appendChild(toggleButton);
        row.appendChild(nombreCell);
        row.appendChild(descripcionCell);
        row.appendChild(mostrarCell);
        ubicacionesBody.appendChild(row);
      });
    }
  }

  toggleMarkerVisibility(ubicacion: any, button: HTMLButtonElement) {
    // Cambia el estado de visibilidad del marcador
    ubicacion.visible = !ubicacion.visible;

    if (ubicacion.visible) {
      ubicacion.marker.addTo(this.map); // Muestra el marcador
      button.innerHTML = `<ion-icon name="eye-outline" style="font-size: 20px;"></ion-icon>`; // Ojo abierto
    } else {
      this.map.removeLayer(ubicacion.marker); // Oculta el marcador
      button.innerHTML = `<ion-icon name="eye-off-outline" style="font-size: 20px;"></ion-icon>`; // Ojo cerrado
    }

    // Verifica el estado general y actualiza el botón "Ocultar todos"
    this.updateToggleAllButton();
  }

  updateToggleAllButton() {
    const toggleButton = document.getElementById('toggleButton');

    // Verifica si toggleButton no es null antes de actualizar su texto
    if (toggleButton) {
      const anyMarkerHidden = this.ubicaciones.some(ubicacion => !ubicacion.visible);
      toggleButton.textContent = anyMarkerHidden ? 'Mostrar Todos los Marcadores' : 'Ocultar Todos los Marcadores';
    }
  }

  toggleAllMarkers() {
    const toggleButton = document.getElementById('toggleButton');
  
    if (toggleButton) {
      const anyMarkerHidden = this.ubicaciones.some(ubicacion => !ubicacion.visible);
  
      // Cambia el estado de visibilidad de todos los marcadores
      this.ubicaciones.forEach(ubicacion => {
        ubicacion.visible = anyMarkerHidden;
        if (ubicacion.visible) {
          ubicacion.marker.addTo(this.map); // Mostrar marcador
        } else {
          this.map.removeLayer(ubicacion.marker); // Ocultar marcador
        }
      });
  
      // Actualiza el texto y los iconos de los botones
      toggleButton.textContent = anyMarkerHidden ? 'Ocultar Todos los Marcadores' : 'Mostrar Todos los Marcadores';
  
      // Cambia los iconos de los botones individuales de acuerdo con la nueva visibilidad
      const iconName = anyMarkerHidden ? 'eye-outline' : 'eye-off-outline';
      document.querySelectorAll('.toggle-button').forEach(button => {
        button.innerHTML = `<ion-icon name="${iconName}" style="font-size: 20px;"></ion-icon>`;
      });
  
      // Agregar y remover clase de hover
      toggleButton.classList.add('hover');
      setTimeout(() => {
        toggleButton.classList.remove('hover');
      }, 1000);
    }
  }  

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Lógica para cerrar sesión
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

  // Método para iniciar sesión
  login() {
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

  // Cerrar el menú de perfil
  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  goToHomePage() {
    this.tabService.selectedTab = 'home';
    this.router.navigate(['/home']);
  }

  goToMapPage() {
    this.tabService.selectedTab = 'map';
    this.router.navigate(['/mapa']);
  }

  goToSchedulePage() {
    this.tabService.selectedTab = 'schedule';
    this.router.navigate(['/horario']);
  }

  // Alternar el estado de apertura/cierre del menú de perfil
  toggleProfileMenu() {
    this.tabService.selectedTab = 'profile';
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}
