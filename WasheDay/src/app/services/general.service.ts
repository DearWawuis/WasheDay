import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../environments/environment.prod';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GeneralService {

  private addressSource = new Subject<string>();
  address$ = this.addressSource.asObservable();

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  // ☢️ Mostrar alerta nativa
  async showToast(message: string, status: string) {
    const { color, icon } = this.getToastDetails(status);

    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      color: color,
      icon: icon,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            console.log('Toast closed');
          },
        },
      ],
    });
    await toast.present();
  }
  // ☢️ 
  changeAddress(address: string) {
    this.addressSource.next(address);
  }

  // ☢️ Está función... determina el color y icono de la alerta
  getToastDetails(status: string): { color: string; icon: string } {
    if (status.includes('danger')) {
      return { color: 'danger', icon: 'close-circle' };
    } else if (status.includes('success')) {
      return { color: 'success', icon: 'checkmark-circle' };
    } else if (status.includes('info')) {
      return { color: 'warning', icon: 'warning' };
    } else {
      return { color: 'secondary', icon: 'alert-circle' };
    }
  }

  // ☢️ Obtiene la URL de la API según la plataforma
  getApiUrl(): string {
    const platform = Capacitor.getPlatform();

    if (platform === 'android') {
      // console.log(environment.apiUrl.android)
      return environment.apiUrl.android; 
    }
    if (platform === 'ios') {
      // console.log(environment.apiUrl.ios)
      return environment.apiUrl.ios; 
    }
    // console.log(environment.apiUrl.web)
    return environment.apiUrl.web; 
  }
}
