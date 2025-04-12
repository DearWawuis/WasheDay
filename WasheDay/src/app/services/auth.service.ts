import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://api-washeday.vercel.app/api/auth'; // URL de tu backend
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { }

  // Método para login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setAuthData(response.token);
        }
      })
    );
  }

  // Método para obtener información del usuario
  getUserInfo(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // 👈 Token incluido manualmente
    });

    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  // Método para registrar un usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  // Guardar datos de autenticación
  private setAuthData(token: string): void {
    localStorage.setItem('authToken', token);

    // Decodificar el token para obtener información básica
    const decodedToken = this.jwtHelper.decodeToken(token);
    if (decodedToken) {
      localStorage.setItem('userId', decodedToken.id);
    }
  }

  // Verifica si hay un token válido
  async checkTokenAndRedirect(): Promise<void> {
    const token = this.getToken();

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      try {
        // Verificar con el backend que el token sigue siendo válido
        const userInfo = await this.getUserInfo().toPromise();

        if (userInfo) {
          localStorage.setItem('userId', userInfo.id),
          localStorage.setItem('userRole', userInfo.role);
          localStorage.setItem('userEmail', userInfo.email);
          localStorage.setItem('userName', userInfo.name);

          const route = userInfo.role === 'washer' ? '/home-washer' : '/home-washo';
          this.router.navigate([route]);
        }
      } catch (error) {
        console.error('Error validando token:', error);
        this.logout(); // Limpiar datos si el token no es válido
      }
    }
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  // Cerrar sesión
  logout(): void {
    // Limpiar almacenamiento
    // localStorage.clear();
    const itemsAEliminar = [
      'userId',
      'userRole',
      'userEmail',
      'userName'
    ];

    itemsAEliminar.forEach(item => {
      localStorage.removeItem(item);
    });

    // Forzar recarga completa después de un pequeño delay
    setTimeout(() => {
      window.location.href = '/login'; // Esto causa una recarga completa
      // O alternativamente:
      // window.location.reload();
    }, 100);
  }

  // Obtener rol del usuario (después de obtener info completa)
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
}
