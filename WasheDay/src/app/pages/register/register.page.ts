import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
})
export class RegisterPage implements OnInit {
  isLoading: boolean = false;
  client?: string; //***Esto será dinamico de acuerdo al tipo de registro que eligen
  client_text1?: string;
  client_text2?: string;
  client_image?: string;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off';
  //Array que guarda los inputs tipo objeto, se define la validacion de cada input
  registerForm: FormGroup = this.formBuilder.group(
    {
      correo: [
        '',
        [Validators.required, Validators.email, this.noWhitespace()],
      ],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?!.(\d)\1\1)(?=.[A-Z])(?=.\d)(?=.[\W_])(?!.*(\d{3})).{8,}$/
          ),
          this.noWhitespace(),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatch }
  ); //Se valida que las contrasenas coincidan

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.authService.checkTokenAndRedirect();

    // Obtener el rol de la navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.client = navigation.extras.state['selectedRole'] || 'WASHER';
      this.updateClientTexts();
    }
  }

  private updateClientTexts() {
    this.client_text1 = this.client == 'WASHO' ? 'A UN PASO PARA' : 'MIS INGRESOS AL';
    this.client_text2 = this.client == 'WASHO' ? 'SER FELIZ' : 'SIG. NIVEL';
    this.client_image = this.client == 'WASHO' ? 'register-image-washo.png' : 'register-image-washer.png';
  }

  //Función para comparar las contraseñas
  passwordMatch(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  //Obtener mensaje de error para mostrar en cada campo
  getErrorMessage(controlName: string) {
    const control = this.registerForm.get(controlName);
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
    if (control?.hasError('mismatch')) {
      return 'Las contraseñas no coinciden';
    }
    if (control?.hasError('whitespace')) {
      return 'Este campo no puede contener espacios';
    }
    return '';
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

  //Ir a la pagina de login
  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  async onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { correo, nombre, apellidos, direccion, password } =
        this.registerForm.value;
      console.log(this.client?.toLowerCase());

      try {
        // Paso 1: Registrar al usuario
        const registerResponse = await this.authService
          .registerUser({
            email: correo,
            name: nombre,
            lname: apellidos,
            address: direccion,
            password: password,
            roles: [this.client?.toLowerCase()], // 'washer' o 'washo' según lo que tengas en this.client
          })
          .toPromise();

        if (registerResponse) {
          // Paso 2: Iniciar sesión automáticamente con las credenciales
          await this.authService.login(correo, password).toPromise();

          // Paso 3: Obtener información del usuario recién registrado
          const userInfo = await this.authService.getUserInfo().toPromise();

          if (userInfo) {
            // Guardar datos en localStorage
            localStorage.setItem('userRole', userInfo.role);
            localStorage.setItem('userEmail', userInfo.email);
            localStorage.setItem('userName', userInfo.name);

            // Redirigir según el rol
            const redirectPath =
              userInfo.role === 'washer' ? '/home-washer' : '/home-washo';
            this.router.navigate([redirectPath]);

            // Mostrar mensaje de éxito
            this.showAlert('Registro exitoso', 'Bienvenido ${userInfo.name}');
          }
        }
      } catch (error: any) {
        this.handleRegisterError(error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  // Función para manejar errores de registro
  private handleRegisterError(error: any) {
    console.error('Error en registro:', error);
    let errorMessage = 'Ocurrió un error durante el registro.';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 400) {
      errorMessage = 'El correo electrónico ya está registrado.';
    } else if (error.status === 0) {
      errorMessage =
        'No se pudo conectar al servidor. Verifica tu conexión a internet.';
    }

    this.showAlert('Error', errorMessage);
  }

  // Función auxiliar para mostrar alertas
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
