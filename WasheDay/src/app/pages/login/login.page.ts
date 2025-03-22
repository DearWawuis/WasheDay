import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
//import { AuthService } from '../../services/auth.service'; // Asegúrate de tener la ruta correcta
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importa AlertController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, RouterModule],
})
export class LoginPage {
  loginForm: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  users: any[] = [
    { email: 'washer@gmail.com', password: '123456', home: '/home-washer', tipo: 'washer' },
    { email: 'washo@gmail.com', password: '123456', home: '/home-washo', tipo: 'washo' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const user = this.users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        this.router.navigate([user.home]); 
        this.showAlert('Inicio de sesión exitoso', `Bienvenido ${user.email}`);
      } else {
        this.showAlert('Error', 'Credenciales incorrectas');
      }
      /*
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Login exitoso', response);
          this.authService.handleLogin(response.user); // Guarda el usuario
          this.showAlert('Inicio de sesión exitoso', 'Has iniciado sesión correctamente.'); // Muestra alerta de éxito
          this.router.navigate(['/home']); // Navegar a la página de inicio
        },
        error => {
          console.error('Error en el login', error);
          this.handleLoginError(error); // Manejar el error de login
        }
      );
      */
    } else {
      this.checkFormValidity(); // Llamar a la función para comprobar la validez del formulario
    }
  }

  checkFormValidity() {
    //Aqui se hacen todas las validaciones de los inputs
    if (this.loginForm.get('email')?.hasError('required')) {
      this.showAlert('Error', 'Rellena este campo: Correo.'); // Mensaje si el campo de correo está vacío
    } else if (this.loginForm.get('email')?.hasError('email')) {
      this.showAlert('Error', 'Formato de correo inválido.'); // Mensaje si el formato del correo es incorrecto
    } else if (this.loginForm.get('password')?.hasError('required')) {
      this.showAlert('Error', 'Rellena este campo: Contraseña.'); // Mensaje si el campo de contraseña está vacío
    }
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
    this.router.navigate(['/registro']); // Navegar a la página de registro
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
}
