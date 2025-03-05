import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Asegúrate de tener la ruta correcta
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importa AlertController

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  registerForm: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private alertController: AlertController) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?!.*(\d)\1\1)(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*(\d{3})).{8,}$/) // Al menos 1 mayúscula, 1 número y 1 carácter especial
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async onRegister() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.showAlert('Error', 'Las contraseñas no coinciden.'); // Alerta si las contraseñas no coinciden
        return;
      }

      this.authService.register(this.registerForm.value).subscribe( //Aqui se está utilizando la función "register" de nuestro archivo auth.service de \services
        response => {
          console.log('Registro exitoso', response);
          this.showAlert('Registro exitoso', 'Revisa tu correo electrónico para activar tu cuenta.'); // Muestra alerta de éxito
          this.router.navigate(['/login']); // Navegar a la página de login
        },
        error => {
          console.error('Error en el registro', error);
          this.handleRegisterError(error); // Manejar el error de registro
        }
      );
    } else {
      this.checkFormValidity(); // Llamar a la función para comprobar la validez del formulario
    }
  }

  checkFormValidity() { //Aqui se hacen todas las validaciones de los inputs
    if (this.registerForm.get('name')?.hasError('required')) {
      this.showAlert('Error', 'Rellena este campo: Nombre.');
    } else if (this.registerForm.get('email')?.hasError('required')) {
      this.showAlert('Error', 'Rellena este campo: Correo.');
    } else if (this.registerForm.get('email')?.hasError('email')) {
      this.showAlert('Error', 'Formato de correo inválido.');
    } else if (this.registerForm.get('password')?.hasError('required')) {
      this.showAlert('Error', 'Rellena este campo: Contraseña.');
    } else if (this.registerForm.get('password')?.hasError('minlength')) {
      this.showAlert('Error', 'La contraseña debe tener al menos 8 caracteres.');
    } else if (this.registerForm.get('password')?.hasError('pattern')) {
      this.showAlert('Error', 'La contraseña debe tener al menos 1 mayúscula, 1 número, 1 carácter especial, NO números consecutivos y NO números repetidos');
    } else if (this.registerForm.get('confirmPassword')?.hasError('required')) {
      this.showAlert('Error', 'Rellena este campo: Confirmar Contraseña.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        role: 'confirm',
        cssClass: 'alert-ok-button', // Añadir clase personalizada
        handler: () => {
          console.log('OK clicked');
        }
      }]
    });
  
    await alert.present();
  
    // Agregar 'aria-label' manualmente usando querySelector
    const okButton = document.querySelector('.alert-ok-button');
    if (okButton) {
      okButton.setAttribute('aria-label', 'Cerrar alerta');
    }
  }  

  handleRegisterError(error: any) {
    // Verifica si hay un error de tipo 409, que generalmente es para correos ya registrados
    switch (error.status) {
      case 409: // Correo ya registrado
        this.showAlert('El correo ya está registrado.', 'error');  // Usamos el servicio de alertas
        break;
      case 400: // Errores relacionados con el cliente (por ejemplo, validaciones)
        this.showAlert('El correo ingresado no es válido. Verifica y prueba de nuevo.', 'error');
        break;
      case 404: // Errores del servidor (por ejemplo, el endpoint no se encuentra)
        this.showAlert('No se pudo encontrar el servidor. Intenta más tarde.', 'error');
        break;
      default: // Para otros errores que no están específicamente manejados
        this.showAlert('No se pudo completar el registro. Intenta de nuevo más tarde.', 'error');
        break;
    }
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

  toggleConfirmPasswordVisibility(): void {
    if (this.confirmPasswordType === 'password') {
      this.confirmPasswordType = 'text';
      this.confirmPasswordIcon = 'eye';
    } else {
      this.confirmPasswordType = 'password';
      this.confirmPasswordIcon = 'eye-off';
    }
  }
}
