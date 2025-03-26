import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    const token = this.authService.getToken();
    const requiredRole = next.data['role'];
    
    // Si no hay token o está expirado
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.authService.logout();
      return false;
    }

    try {
      const userInfo = await this.authService.getUserInfo().toPromise();
      
      if (userInfo) {
        // Guardar datos del usuario
        localStorage.setItem('userRole', userInfo.role);
        localStorage.setItem('userEmail', userInfo.email);
        localStorage.setItem('userName', userInfo.name);

        // Verificar rol si es necesario
        if (requiredRole && userInfo.role !== requiredRole) {
          this.router.navigate([userInfo.role === 'washer' ? '/home-washer' : '/home-washo']);
          return false;
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error validando token:', error);
      this.authService.logout();
      return false;
    }
  }
}