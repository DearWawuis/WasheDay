import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
})
export class LoginPage {
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, this.noWhitespace()]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          /^(?!.*(\d)\1\1)(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*(\d{3})).{8,}$/
        ),
        this.noWhitespace(),
      ],
    ],
  });
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.checkTokenAndRedirect();
  }

  //Obtener mensaje de error para mostrar en cada campo
  getErrorMessage(controlName: string) {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control?.hasError('email')) {
      return 'Por favor ingrese un correo electrónico válido.';
    }
    if (control?.hasError('pattern')) {
      if (controlName == 'password') {
        return 'La contraseña debe tener al menos 1 mayúscula, 1 número, 1 carácter especial, NO números consecutivos y NO números repetidos.';
      }
      return 'El formato del campo es incorrecto.';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 carácteres.';
    }
    if (control?.hasError('whitespace')) {
      return 'Este campo no puede contener espacios';
    }
    return '';
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      console.log(email, password);
      try {
        // Paso 1: Iniciar sesión para obtener el token
        await this.authService.login(email, password).toPromise();
        
        // Paso 2: Obtener información del usuario incluyendo el rol
        const userInfo = await this.authService.getUserInfo().toPromise();
        
        if (userInfo) {
          // Guardar el rol en localStorage
          localStorage.setItem('userRole', userInfo.role);
          localStorage.setItem('userEmail', userInfo.email);
          localStorage.setItem('userName', userInfo.name);
          
          // Redirigir según el rol
          if (userInfo.role === 'washer') {
            this.router.navigate(['/home-washer']);
          } else if (userInfo.role === 'washo') {
            this.router.navigate(['/home-washo']);
          }
          
          this.showAlert('Inicio de sesión exitoso', `Bienvenido ${userInfo.name}`);
        }
      } catch (error: any) {
        this.handleLoginError(error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  //Validar que no tenga espacios
  noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.includes(' ')) {
        return { whitespace: true };
      }
      return null;
    };
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          cssClass: 'alert-ok-button', // Añadir clase personalizada
          handler: () => {
            console.log('OK clicked');
          },
        },
      ],
    });

    await alert.present();

    // Agregar 'aria-label' manualmente usando querySelector
    const okButton = document.querySelector('.alert-ok-button');
    if (okButton) {
      okButton.setAttribute('aria-label', 'Cerrar alerta');
    }
  }

  handleLoginError(error: any) {
    // Maneja diferentes errores
    switch (error.status) {
      case 404:
        this.showAlert('Error', 'No se encontró el correo.'); // Mostrar alerta si el correo no existe
        break;
      case 401:
        this.showAlert('Error', 'Contraseña incorrecta.'); // Mostrar alerta si la contraseña es incorrecta
        break;
      case 403:
        this.showAlert(
          'Error',
          'Por favor, verifica tu correo antes de iniciar sesión.'
        ); // Mostrar alerta si no está verificado
        break;
      default:
        this.showAlert('Error', 'Ocurrió un error inesperado.'); // Mostrar alerta en caso de error inesperado
        break;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']); // Navegar a la página de registro
  }

  togglePasswordVisibility(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  openRoleSelectionModal() {
    const modal = document.getElementById('roleSelectionModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  closeModal() {
    const modal = document.getElementById('roleSelectionModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  selectRole(role: string) {
    this.closeModal();
    this.router.navigate(['/register'], { 
      state: { selectedRole: role } 
    });
  }

  
}

