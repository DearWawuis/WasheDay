import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { ScheduleService } from '../../services/schedule.service'; 
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { TabService } from '../../services/tab.service';
import { ModalController } from '@ionic/angular';
import { ScheduleModalComponent } from 'src/app/components/schedule-modal/schedule-modal.component';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-horario-detalles',
  templateUrl: './horario-detalles.page.html',
  styleUrls: ['./horario-detalles.page.scss'],
})
export class HorarioDetallesPage implements OnInit {
  isProfileMenuOpen: boolean = false; // Controlar si el menú está abierto o cerrado
  isLoggedIn: boolean = false; // Controlar si el usuario está autenticado
  userName: string = ''; // Variable para almacenar el nombre del usuario
  private routerSubscription!: Subscription; // Suscripción a eventos de navegación
  day: string = '';
  userId: number;
  schedule: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService, 
    private scheduleService: ScheduleService,
    private router: Router, // Router para redireccionar
    private modalController: ModalController,
    private navCtrl: NavController,
    public tabService: TabService) { 
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
    this.isLoggedIn = !!this.userName; 
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.day = params.get('day') || '';
      this.loadSchedule();
    });
  }

    loadSchedule() {
      this.scheduleService.getScheduleByDayAndUser(this.day, this.userId).subscribe((data) => {
        this.schedule = data;

      });
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
  volver() {
    this.navCtrl.back();
  }
}

