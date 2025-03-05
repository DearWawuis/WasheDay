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
  selector: 'app-horario-materia',
  templateUrl: './horario-materia.page.html',
  styleUrls: ['./horario-materia.page.scss'],
})
export class HorarioMateriaPage implements OnInit {
  isProfileMenuOpen: boolean = false; // Controlar si el menú está abierto o cerrado
  isLoggedIn: boolean = false; // Controlar si el usuario está autenticado
  userName: string = ''; // Variable para almacenar el nombre del usuario
  private routerSubscription!: Subscription; // Suscripción a eventos de navegación
  userId: number;
  subjects: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService, 
    private scheduleService: ScheduleService,
    private router: Router, 
    private modalController: ModalController,
    private navCtrl: NavController,
    public tabService: TabService) { 
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
    this.isLoggedIn = !!this.userName; 
  }

  ngOnInit() {
    this.loadSubjects();
    this.scheduleService.modalClosed$.subscribe(()=>{
      this.loadSubjects();
      })
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.closeProfileMenu(); // Cerrar el menú al cambiar de página
        }
      });
  }

    loadSubjects() {
      this.scheduleService.getSubjectByUser(this.userId).subscribe((data) => {
        this.subjects = data; 
      });
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

// Alternar el estado de apertura/cierre del menú de perfil
toggleProfileMenu() {
  this.tabService.selectedTab = 'profile';
  this.isProfileMenuOpen = !this.isProfileMenuOpen;
}

handleIconAddClick(idsubject: number) {
  this.presentModal(idsubject); 
}

async presentModal(idsubject:  number,) {
  console.log(idsubject+' mmm '+this.userId);
  const modal = await this.modalController.create({
    component: ScheduleModalComponent,
    componentProps: { existId: idsubject, userId: this.userId  } //Se pasan estos parametros
  });
  
  return await modal.present();
}

handleScheduleUpdate(eventData: any) {
  if (eventData.action === 'delete') {
    this.subjects = this.subjects.filter(subject => subject.id !== eventData.id);
  } else if (eventData.action === 'update') {
    this.loadSubjects();  // Recargar la lista completa
  } else if (eventData.action === 'create') {
    this.loadSubjects();  // Recargar la lista si se ha creado una nueva materia
  }
}
volver() {
  this.navCtrl.back();
}
}
