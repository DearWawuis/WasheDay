
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabBarComponent implements OnInit {
  showTabs: boolean = false;
  address: string = 'Obteniendo ubicación...';
  public isLargeScreen: boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private alertController: AlertController,
    private generalService: GeneralService,
    private authService: AuthService
  ) {
    this.isLargeScreen = window.innerWidth >= 765;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url.includes('login') || event.url.includes('register') || event.url.includes('payment-method-washo') || event.url.includes('stripe-washo')) {
          this.showTabs = false;
        } else {
          this.showTabs = true;
        }
      }
    });
    // --- 
    this.generalService.address$.subscribe((newAddress) => {
      this.address = newAddress;
      console.log('Dirección recibida:', this.address);
    });
  }

  // cambios tiempo real
  @HostListener('window:resize', ['$event'])
  updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 765;
  }

  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Salir de la sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'salir',
          handler: () => {
            this.authService.logout();
            // this.router.navigate(['/login']);
            // window.location.href = '/login';
          },
        },
      ],
    });
    await alert.present();
  }
  
  async redirecion(url: string) {
    this.router.navigate([url]);
  }
}
