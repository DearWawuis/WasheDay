import { Component, OnInit } from '@angular/core';
import { StripeRestService } from '../../../services/stripe-rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-method-washo',
  templateUrl: './payment-method-washo.page.html',
  styleUrls: ['./payment-method-washo.page.scss'],
  standalone: false,
})
export class PaymentMethodWashoPage implements OnInit {
  name: string = 'Servicio de lavado';
  description: string = '8 kg de ropa';
  amount: number = 280;
  paymentMethod: string = 'card';

  paymentCompleted: boolean = false;
  // paymentMethod: string = '';

  constructor(private restService: StripeRestService, private router: Router) {}

  ngOnInit() {
  }

  //Funcion para iniciar el proceso de pago con Stripe, se genera una orden de pago y se redirige
  //A la pagina de cobro
  init(): void {
    try {
      const data = {
        name: this.name,
        amount: this.amount,
      };
      this.restService.generateOrder(data).subscribe(({ data }) => {
        this.router.navigate(['/', 'stripe-washo', data?.localizator]);
      });
    } catch (e) {
      console.log('Ocurrio error.....');
    }
  }

  proceed() {
    if (!this.paymentMethod) {
      console.warn('Por favor selecciona un método de pago');
      return;
    }

    // Simulamos el procesamiento con un timeout
    setTimeout(() => {
      // 1. Obtener serviceData existente
      const serviceData = JSON.parse(localStorage.getItem('serviceData') || 'null');

      if (serviceData && serviceData !== 'null') {
        let emaill = localStorage.getItem('userEmail');
        if (!emaill && emaill == 'null') {
          this.router.navigate(['/login']);
          return;
        }
        // 2. Agregar método de pago y fecha
        const compraCompleta = {
          ...serviceData,
          paymentMethod: this.paymentMethod,
          email: emaill,
          paymentDate: new Date().toISOString(),
          status: 'completed'
        };

        // 3. Obtener o crear el array comprasStorage
        let comprasStorage = JSON.parse(localStorage.getItem('comprasStorage') || '[]');
        if (comprasStorage === '[]') comprasStorage = [];

        // 4. Agregar la nueva compra
        comprasStorage.push(compraCompleta);

        // 5. Guardar en localStorage
        localStorage.setItem('comprasStorage', JSON.stringify(comprasStorage));

        // 6. Eliminar serviceData
        localStorage.removeItem('serviceData');

        // 7. Mostrar confirmación
        this.paymentCompleted = true;

        // const hy = JSON.parse(localStorage.getItem('serviceData') || 'null');
        // let jjj = JSON.parse(localStorage.getItem('comprasStorage') || '[]');
        // console.log('Todas las compras:', jjj);
        // console.log('Todas las compras:', hy);
      } else {
        console.error('No se encontraron datos del servicio');
      }
    }, 1500);
  }

  goBack() {
    // this.router.navigate(['/home-washo']);
    window.location.href = '/home-washo';
  }


  //Al presionar el boton de Proceder, si es pago con tarjeta llamar la funcion init(), sino handleMoneyPayment()
  proceedg(): void {
    if (this.paymentMethod === 'card') {
      this.init();
    } else {
      this.handleMoneyPayment();
    }
  }

  //Funcion cuando es pago en efectivo contra entrega (solo se cabiara el status en la bd)
  handleMoneyPayment(): void {
    console.log('Pago con efectivo contra entrega');
    //CONSUMIR SERVICIO......
  }
}
