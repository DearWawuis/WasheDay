import { ChangeDetectorRef, Component, OnInit, OnDestroy  } from '@angular/core';
import { WindowRef } from "../../../services/WindowRef";
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StripeRestService } from "../../../services/stripe-rest.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { ToastController } from '@ionic/angular';

declare global {
  interface Window {
    Stripe?: any;
  }
}

@Component({
  selector: 'app-stripe-washo',
  templateUrl: './stripe-washo.page.html',
  styleUrls: ['./stripe-washo.page.scss'],
  standalone: false
})
export class StripeWashoPage implements OnInit {
  private readonly STRIPE!: any; 
  private elementStripe!: any;
  cardNumber: any;
  cardCvv: any;
  cardExp: any;
  form: FormGroup = new FormGroup({})
  id!: string;
  orderData!: any;
  /* 
  TARJETAS DE PRUEBA
       Tarjeta: 4242 4242 4242 4242
       CVC: 123
       Fecha expiracion: fecha futura

       Tarjeta: 5555 5555 5555 4444
       CVC: 123
       Fecha expiracion: fecha futura

       Tarjeta: 3782 8224 6310 005
       CVC: 1234
       Fecha expiracion: fecha futura

  
  */

  constructor(private fb: FormBuilder,
              private toastController: ToastController,
              private cd: ChangeDetectorRef, 
              private restService: StripeRestService,
              private route: ActivatedRoute,
              private router: Router
     ) { 
      this.STRIPE = window.Stripe(environment.stripe_pk);
     }

  ngOnInit() {
    //this.id = '32b783e7-4ec0-4cab-bf67-c820dc1c9c5b'; //Id para pruebas sin servicio
    this.id = this.route.snapshot.paramMap.get('id') || ''; //Id de la orden de pago real

    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.max(100000)]],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]], 
      cardCvv: [false, [Validators.required, Validators.requiredTrue]],
      cardExp: [false, [Validators.required, Validators.requiredTrue]],
    })
    this.loadDetail();
    this.createStripeElement()
  }



  loadDetail(): void {
    this.restService.getOrderDetail(this.id).subscribe(({data}) => {
      this.orderData = data;
      if (data.status.includes('succe')) {
        this.form.disable();
        this.showToast('success', '¡Ya está pagado!');
      }
      this.form.patchValue({
        amount: data.amount
      })
    })
  }
 
//Crear elementos de Stripe en el DOM  
  private createStripeElement = () => {
    if (this.cardNumber && this.cardExp && this.cardCvv) {
      console.log("Los elementos de Stripe ya han sido creados.");
      return; // Si ya existen, no crearlos
    }
    const style = {
      base: {
        color: '#219EBC',
        fontWeight: 400,
        fontFamily: '\'Poppins\', sans-serif',
        fontSize: '20px',
        '::placeholder': {
          color: '#E3E2EC',
        },
      },
      invalid: {
        color: '#dc3545',
      },
    };

    //SDK de Stripe inicia la generacion de elementos
    this.elementStripe = this.STRIPE.elements({
      fonts: [
        {
          cssSrc:
            'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap',
        },
      ],
    });

    //SDK Construimos los inputs de tarjeta, cvc, fecha con estilos
    const cardNumber = this.elementStripe.create('cardNumber', {
      placeholder: '4242 4242 4242 4242',
      style,
      classes: {
        base: 'input-stripe-custom'
      },
    });
    const cardExp = this.elementStripe.create('cardExpiry', {
      placeholder: 'MM/AA',
      style,
      classes: {
        base: 'input-stripe-custom'
      },
    });
    const cardCvc = this.elementStripe.create('cardCvc', {
      placeholder: '000',
      style,
      classes: {
        base: 'input-stripe-custom'
      },
    });

    //SDK Montamos los elementos en nuestros DIV identificados on el #id
    cardNumber.mount('#card');
    cardExp.mount('#exp');
    cardCvc.mount('#cvc');

    this.cardNumber = cardNumber;
    this.cardExp = cardExp;
    this.cardCvv = cardCvc;

    //Escuchamos los eventos del SDK
    this.cardNumber.addEventListener('change', this.onChangeCard.bind(this));
    this.cardExp.addEventListener('change', this.onChangeExp.bind(this));
    this.cardCvv.addEventListener('change', this.onChangeCvv.bind(this));

  }

//Iniciar pago
async initPay(): Promise<any> {
    try {
      this.form.disable();
      //SDK de Stripe genera un TOKEN para la intencion de pago!
      const {token} = await this.STRIPE.createToken(this.cardNumber)

      //Enviamos el token a nuesta api donde generamos (stripe) un metodo de pago basado en el token
      const {data} = await this.restService.sendPayment(token.id, this.id)

      //Nuestra api devuelve un "client_secret" que es un token unico por intencion de pago
      //SDK de stripe se encarga de verificar si el banco necesita autorizar o no
      this.STRIPE.handleCardPayment(data.client_secret)
        .then(async () => {
          //Enviamos el id "localizador" de nuestra orden para decirle al backend que confirme con stripe si es verdad!
          await this.restService.confirmOrder(this.id);
          this.showToast('success', '¡Pago Exitoso!');
          this.router.navigate(['/payment-method-washo']);

        })
        .catch(() => {
          this.showToast('danger', '¡Hubo un error con el pago!');
        })
    } catch (e) {
       this.showToast('danger', '¡Algo ocurrio mientras procesaba el pago!');
    }

  }


//Manejadores de validacion de input de stripe
  onChangeCard({error}: any) {
    this.form.patchValue({cardNumber: !error});
  }

  onChangeCvv({error}: any) {
    this.form.patchValue({cardCvv: !error});
  }

  onChangeExp({error}: any) {
    this.form.patchValue({cardExp: !error});
  } 


//Mostrar toast
async showToast(color: string, message: string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000,
    color: color, 
    position: 'top' 
  });
  toast.present();
}  
}
