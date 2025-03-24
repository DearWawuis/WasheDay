import { Component, OnInit } from '@angular/core';
import { StripeRestService } from "../../../services/stripe-rest.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-payment-method-washo',
  templateUrl: './payment-method-washo.page.html',
  styleUrls: ['./payment-method-washo.page.scss'],
  standalone: false
})
export class PaymentMethodWashoPage implements OnInit {
  name: string = 'Servicio de lavado';
  description: string = '8 kg de ropa';
  amount : number = 280;
  paymentMethod: string = 'card'; 

  constructor(private restService: StripeRestService,
              private router: Router
  ) { }

  ngOnInit() {
  }


//Funcion para iniciar el proceso de pago con Stripe, se genera una orden de pago y se redirige 
//A la pagina de cobro 
  init(): void {
    try {
      const data = {
        name: this.name,
        amount: this.amount
      }
      this.restService.generateOrder(data)
        .subscribe(({data}) => {
          this.router.navigate(['/', 'stripe-washo', data?.localizator])
        })
    } catch (e) {
      console.log('Ocurrio error.....')
    }
  }

//Al presionar el boton de Proceder, si es pago con tarjeta llamar la funcion init(), sino handleMoneyPayment()
  proceed(): void {
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
