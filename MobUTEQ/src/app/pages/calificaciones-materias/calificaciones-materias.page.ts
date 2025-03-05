import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CuatrimestreService } from 'src/app/services/cuatrimestre.service';
import { Subscription } from 'rxjs';
import { TabService } from '../../services/tab.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { MateriaModalComponent } from 'src/app/components/materia-modal/materia-modal.component';

@Component({
  selector: 'app-calificaciones-materias',
  templateUrl: './calificaciones-materias.page.html',
  styleUrls: ['./calificaciones-materias.page.scss'],
})
export class CalificacionesMateriasPage implements OnInit, OnDestroy {

  isProfileMenuOpen: boolean = false;
  isLoggedIn: boolean = false;
  userName: string = '';
  userId: number;
  private routerSubscription!: Subscription;
  selectedButton: number = 0;
  cuatrimestres: any[] = [];
  cuatrimestreNumber!: number;
  cuatrimestreId!: number;
  cuatriLast!: number;
  materias: any = [];
  calificaciones: any[] = [];
  calificacionesAgrupadas: any[] = [];
  promedioGeneral: number = 0;
  mostrarIconoEliminar: boolean = false;

  selectedMateria: number | null = null; // Asegúrate de declarar la propiedad para almacenar el ID de la materia seleccionada
  parcial: number | null = null;         // Propiedad para almacenar el número de parcial
  calificacion: number | null = null;    // Propiedad para almacenar la calificación

  constructor(
    private authService: AuthService,
    private router: Router,
    public tabService: TabService,
    private route: ActivatedRoute,
    private cuatrimestreService: CuatrimestreService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.userName = this.authService.getUserName();
    this.userId = this.authService.getUserId();
    this.isLoggedIn = !!this.userName; // Verifica si el usuario está autenticado
  }

  ngOnInit() {
    // Suscripción a eventos de navegación
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeProfileMenu();
        console.log(this.userId);
      }
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cuatrimestreId = navigation.extras.state['id'];
      this.cuatrimestreNumber = navigation.extras.state['numero'];
      this.cuatriLast = navigation.extras.state['ultCuatri'];

      //console.log('Cuatrimestre ID:', this.cuatrimestreId);
      //console.log('Cuatrimestre Número:', this.cuatrimestreNumber);
      //console.log('Último cuatrimestre:', this.cuatriLast);

      // Mostrar el icono de eliminar solo si el cuatrimestre actual es el último
      if (this.cuatrimestreNumber === this.cuatriLast) {
        this.mostrarIconoEliminar = true;
      } else {
        this.mostrarIconoEliminar = false;
      }
    }

    this.loadMaterias();
    this.loadCalificaciones(this.userId, this.cuatrimestreNumber);
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadMaterias() {
    this.cuatrimestreService.getMateriasByCuatrimestre(this.cuatrimestreId).subscribe((data) => {
      this.materias = data;
    }, (error) => {
      console.error('Error al obtener materias:', error);
    });
  }

  loadCalificaciones(userId: number, cuatrimestreNumber: number): void {
    this.cuatrimestreService.getCalificacionesByAlumno(userId, cuatrimestreNumber).subscribe(
      (data) => {
        this.calificacionesAgrupadas = this.cuatrimestreService.agruparCalificacionesPorMateria(data);
        // Calcular el promedio general usando el servicio
        this.promedioGeneral = this.cuatrimestreService.calcularPromedioGeneral(this.calificacionesAgrupadas);
      },
      (error) => {
        console.error('Error al obtener calificaciones:', error);
      }
    );
  }

  async agregarMateria() {
    // Cargar materias para el cuatrimestre actual
    this.cuatrimestreService.getMateriasByCuatrimestre(this.cuatrimestreNumber).subscribe(async (materias) => {
      // Crear opciones para el desplegable (ion-select)
      const options = materias.map((materia) => ({
        text: materia.nombre,  // Nombre de la materia
        value: materia.id      // ID de la materia
      }));
  
      // Crear modal para seleccionar la materia y añadir calificación
      const modal = await this.modalController.create({
        component: MateriaModalComponent,  // Usamos el componente del modal
        componentProps: { options: options } // Pasamos las opciones de materia al modal
      });
  
      modal.onDidDismiss().then(async (result) => {
        const data = result.data;
        if (data) {
          // Verificar si ya existe una calificación para la materia y el parcial
          this.cuatrimestreService.verificarCalificacionExistente(
            this.userId,
            this.cuatrimestreNumber,
            data.selectedMateria,
            data.parcial
          ).subscribe(async (exists: boolean) => {
            if (exists) {
              // Mostrar alerta si ya existe
              await this.mostrarAlerta(
                'Error',
                'Ya existe una calificación registrada para esta materia y parcial.'
              );
            } else {
              // Crear la nueva calificación
              this.crearCalificacion({
                id_materia: data.selectedMateria,
                id_usuario: this.userId,
                numero_cuatrimestre: this.cuatrimestreNumber,
                parcial: data.parcial,
                calificacion: data.calificacion
              });
            }
          }, (error: any) => {
            console.error('Error al verificar la calificación:', error);
          });
        }
      });
  
      await modal.present();
    }, (error) => {
      console.error('Error al cargar materias:', error);
    });
  }
  
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  crearCalificacion(calificacionData: { id_materia: number; id_usuario: number; numero_cuatrimestre: number; parcial: number; calificacion: number }) {
    this.cuatrimestreService.createCalificacion(calificacionData).subscribe(
      (response) => {
        console.log('Calificación agregada:', response);
        this.loadCalificaciones(calificacionData.id_usuario, this.cuatrimestreNumber);
      },
      (error) => {
        console.error('Error al agregar calificación:', error);
      }
    );
  }

  confirmarEliminacion(cuatrimestreId: number, cuatrimestreNumber: number) {
    this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el Cuatrimestre ${cuatrimestreNumber}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Llamar al servicio para eliminar el cuatrimestre
            this.cuatrimestreService.deleteCuatrimestre(this.userId, cuatrimestreId).subscribe(
              (response) => {
                // Mostrar alerta de éxito
                this.alertController.create({
                  header: 'Eliminación exitosa',
                  message: `El Cuatrimestre ${cuatrimestreNumber} ha sido eliminado con éxito.`,
                  buttons: ['Aceptar'] // Botón para cerrar la alerta
                }).then(alert => alert.present());

                // Opcional: Redirigir al usuario después de 1 segundo (como en tu código original)
                setTimeout(() => this.volver(), 1000);
              },
              (error) => {
                // Manejar errores si ocurren
                console.error('Error al eliminar el cuatrimestre:', error);
                this.alertController.create({
                  header: 'Error',
                  message: 'Hubo un problema al eliminar el cuatrimestre. Intenta nuevamente.',
                  buttons: ['Aceptar']
                }).then(alert => alert.present());
              }
            );
          }
        }
      ]
    }).then(alert => alert.present());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
  }

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

  toggleProfileMenu() {
    this.tabService.selectedTab = 'profile';
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  volver() {
    this.navCtrl.back();
  }
}
