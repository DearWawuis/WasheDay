import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule} from "@angular/forms";
import { Router, RouterModule  } from "@angular/router";
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule ]
})
export class RegisterPage implements OnInit {
  client: string = 'WASHER'; //***Esto será dinamico de acuerdo al tipo de registro que eligen
  client_text1: string = this.client == 'WASHO' ? 'A UN PASO PARA' : 'MIS INGRESOS AL'; 
  client_text2: string = this.client == 'WASHO' ? 'SER FELIZ' : 'SIG. NIVEL'; 
  client_image: string = this.client == 'WASHO' ? 'register-image-washo.png' : 'register-image-washer.png';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off';
//Array que guarda los inputs tipo objeto, se define la validacion de cada input
registerForm: FormGroup = this.formBuilder.group({
  correo: ['',[Validators.required, Validators.email, this.noWhitespace()]],
  nombre: ['',[Validators.required]],
  apellidos: ['',[Validators.required]],
  direccion: ['',[Validators.required]],
  password: ['', [
    Validators.required, 
    Validators.minLength(6), 
    Validators.pattern(/^(?!.*(\d)\1\1)(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*(\d{3})).{8,}$/), 
    this.noWhitespace()]],
  confirmPassword: ['',[Validators.required]]
}, { validators: this.passwordMatch }); //Se valida que las contrasenas coincidan
  
constructor(
  private formBuilder: FormBuilder,
  private router: Router,
  private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkTokenAndRedirect();
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
        if(controlName=='password'){
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
      return { 'whitespace': true }; 
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
}
