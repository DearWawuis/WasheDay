import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapaComponent } from '../../../components/washo/mapa/mapa.component';

import { Router } from '@angular/router';

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
  misCompras: any[] = [];

  constructor(public modalController: ModalController, private router: Router) {
    this.isLargeScreen = window.innerWidth >= 765;
  }

  // cambios tiempo real
  @HostListener('window:resize', ['$event'])
  updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 765;
  }

  ngOnInit() {
    this.updateScreenSize();

    this.cargarMisCompras();
  }

  cargarMisCompras() {
    // Obtener email del usuario actual
    const userEmail = localStorage.getItem('userEmail');

    // Validar si el usuario está logueado
    if (!userEmail || userEmail === 'null') {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Obtener todas las compras
      const compras = localStorage.getItem('comprasStorage');
      const todasCompras = compras ? JSON.parse(compras) : [];

      // Filtrar solo las compras del usuario actual
      this.misCompras = todasCompras.filter((compra: any) =>
        compra.email && compra.email === userEmail
      );

      // Ordenar por fecha más reciente primero
      this.misCompras.sort(
        (a: any, b: any) =>
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
      );

      console.log('Compras del usuario:', this.misCompras);
    } catch (error) {
      console.error('Error al cargar compras:', error);
      this.misCompras = [];
    }
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

  mostrarMisCompras() {
    // Obtener datos del localStorage
    const comprasStorage = JSON.parse(
      localStorage.getItem('comprasStorage') || '[]'
    );

    // Verificar si hay compras
    if (comprasStorage.length === 0) {
      console.log('No tienes compras registradas');
      return;
    }

    // Iterar y mostrar cada compra
    comprasStorage.forEach((compra: any, index: number) => {
      console.group(`Compra #${index + 1}`);
      console.log(
        'Lavandería:',
        compra.lavanderia?.nombre || 'No especificada'
      );
      console.log('Servicio:', compra.serviceOption);
      console.log('Fecha:', compra.date);
      console.log('Hora:', compra.time);
      console.log('Método de pago:', compra.paymentMethod);
      console.log('Estado:', compra.status);
      console.log(
        'Fecha de pago:',
        new Date(compra.paymentDate).toLocaleString()
      );
      console.groupEnd();
    });
  }
}
