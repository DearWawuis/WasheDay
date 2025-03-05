import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { TabService } from '../../services/tab.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ScheduleModalComponent } from 'src/app/components/schedule-modal/schedule-modal.component';
import { ScheduleService } from '../../services/schedule.service';
import { AlertController } from '@ionic/angular'
import { S } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.page.html',
  styleUrls: ['./horario.page.scss'],
})
export class HorarioPage implements OnInit {
  isProfileMenuOpen: boolean = false; // Controlar si el menú está abierto o cerrado
  isLoggedIn: boolean = false; // Controlar si el usuario está autenticado
  userName: string = ''; // Variable para almacenar el nombre del usuario
  userId: number;
  private routerSubscription!: Subscription; // Suscripción a eventos de navegación
  currentDay: string = '';
  daysOfWeek: string[] = ['Sábado', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  class: any = {};
  cards: { day: string }[] = [
    { day: 'Lunes' },
    { day: 'Martes' },
    { day: 'Miércoles' },
    { day: 'Jueves' },
    { day: 'Viernes' },
    { day: 'Sábado' }
  ];
  alertButtons = [
    {
      text: 'Aceptar',
      handler: () => {
        console.log('Ok clicked');
      }
    }
  ];

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para redireccionar
    public tabService: TabService,
    private modalController: ModalController,
    private scheduleService: ScheduleService,
    private alertController: AlertController,
  ) { 
    this.userName = this.authService.getUserName(); // Método para obtener el nombre del usuario
    this.userId = this.authService.getUserId();
    this.isLoggedIn = !!this.userName; // Comprobar si el usuario está autenticado
  }

  ngOnInit() {
     // Suscribirse a los eventos de navegación
     this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeProfileMenu();
      }
    });
    this.getCurrentDay();
    this.scheduleService.verifyCuatri(this.userId).subscribe((data) => {
     console.log(data);
     if(data.status !== 'ok'){
      this.presentAlert(data.status, data.message);
     }
    })
    this.scheduleService.getClassNowAndNext(this.currentDay, this.userId).subscribe((data) => {
      this.class = data;
     console.log(this.class);
    })
   
  }
  ionViewWillEnter() {
    // Se verifican los datos al ingresar a la vista
    this.scheduleService.verifyCuatri(this.userId).subscribe((data) => {
      console.log(data);
      if (data.status !== 'ok') {
        this.presentAlert(data.status, data.message);
      }
    });
    
    this.scheduleService.getClassNowAndNext(this.currentDay, this.userId).subscribe((data) => {
      this.class = data;
      console.log(this.class);
    });
  }
  getCurrentDay() {
    const daysOfWeek = ['Sábado', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const today = new Date();
    const dayIndex = today.getDay();  // Devuelve el índice del día de la semana
    this.currentDay = daysOfWeek[dayIndex];  // Mapea el índice al nombre del día
    console.log('Hoy es:', this.currentDay);
  }

  async presentAlert(status: string, message:string) {
   console.log('okkk'+message);
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message, 
      buttons: this.alertButtons
    });

    await alert.present();
  }

  getClassNameNow() {
    return this.class;
  }

  getCardColor(cardDay: string): string {
    return this.currentDay === cardDay ? 'secondary' : '';  // Si el card es el día actual, color "secondary"
  }

  goToDetailsPage(day: string) {
    this.router.navigate(['/horario-detalles', { day: day }]);
  }
  
  goToDetailsSubjects() {
    this.router.navigate(['/horario-materia']);
  }

  handleIconAddClick(id:  number) {
    this.presentModal(id); 
  }

  async presentModal(id: number) {
    const modal = await this.modalController.create({
      component: ScheduleModalComponent,
      componentProps: { existId: id, userId: this.userId } //Se pasan estos parametros al calendar-modal.component
    });
    
    return await modal.present();
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Lógica para cerrar sesión
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

  // Método para iniciar sesión
  login() {
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

  // Cerrar el menú de perfil
  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  goToHomePage() {
    this.tabService.selectedTab = 'home';
    this.router.navigate(['/home']);
  }

  goToMapPage() {
    this.tabService.selectedTab = 'map';
    this.router.navigate(['/mapa']);
  }

  goToSchedulePage() {
    this.tabService.selectedTab = 'schedule';
    this.router.navigate(['/horario']);
  }

  goToGrades() {
    this.tabService.selectedTab = '';
    this.router.navigate(['/calificaciones']);
  }

  // Alternar el estado de apertura/cierre del menú de perfil
  toggleProfileMenu() {
    this.tabService.selectedTab = 'profile';
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}
