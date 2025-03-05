import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router'; // Importa Router para redireccionar
import { Subscription } from 'rxjs';
import { TabService } from '../../services/tab.service';
import { Chart, registerables } from 'chart.js';
import { CuatrimestreService } from 'src/app/services/cuatrimestre.service';
import { NavController } from '@ionic/angular';

Chart.register(...registerables);

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.page.html',
  styleUrls: ['./calificaciones.page.scss'],
})
export class CalificacionesPage implements OnInit {

  isProfileMenuOpen: boolean = false; // Controlar si el menú está abierto o cerrado
  isLoggedIn: boolean = false; // Controlar si el usuario está autenticado
  userName: string = ''; // Variable para almacenar el nombre del usuario
  userId: number;
  private routerSubscription!: Subscription; // Suscripción a eventos de navegación
  selectedButton: number = 0; // Inicializa como vacío o con un valor predeterminado
  selectedCuatrimestreNumero: number = 0;
  cuatrimestres: any[] = [];
  cuatriLast: number = 0;
  intervalId: any;
  slideOpts = {
    slidesPerView: 3,
    spaceBetween: 5,
    centeredSlides: false,
  };

  calificacionesAgrupadas: any[] = [];
  promediosCuatris: number[] = [];
  promedioCuatri: number = 0;
  promedioGeneral: number = 0;
  private chartInstance: Chart | null = null;
  topUsers: any[] = [];

  selectButton(cuatrimestre: { [key: string]: any }) {
    this.selectedButton = cuatrimestre['id']; // Usamos la notación de corchetes
    this.selectedCuatrimestreNumero = cuatrimestre['numero']; // Acceder al 'numero' también de esta forma
    //console.log('Cuatrimestre ID:', this.selectedButton);
    //console.log('Cuatrimestre Número:', this.selectedCuatrimestreNumero);
  }


  constructor(
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para redireccionar
    private cuatrimestreService: CuatrimestreService,
    public tabService: TabService,
    private navCtrl: NavController,
  ) {
    // Inicializar el nombre del usuario y el estado de autenticación
    this.userName = this.authService.getUserName(); // Método para obtener el nombre del usuario
    this.userId = this.authService.getUserId();
    this.isLoggedIn = !!this.userName; // Comprobar si el usuario está autenticado
  }

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeProfileMenu(); // Cerrar el menú al cambiar de página
      }
    });

    this.loadTopUsers();

    // Configurar un temporizador para recargar los cuatrimestres cada 5 minutos (300,000 ms)
    this.intervalId = setInterval(() => {
      this.actualizarDatos();
    }, 100000); // Cambia este valor según el intervalo que prefieras

    // Forzar la redimensión de la gráfica en el cambio de tamaño de ventana
    window.addEventListener('resize', this.updateChartSize.bind(this));
  }

  ionViewWillEnter() {
    this.actualizarDatos();
  }

  ionViewWillLeave() {
    if (this.chartInstance) {
      this.chartInstance.destroy(); // Elimina la instancia de la gráfica
      this.chartInstance = null; // Asegúrate de reiniciar la referencia
    }
    if (this.promediosCuatris) {
      this.promediosCuatris = [];
    }
    if (this.promedioGeneral) {
      this.promedioGeneral = 0;
    }
  }


  actualizarDatos() {
    this.loadCuatrimestres();

    // Espera un poco para asegurar que todos los datos se hayan cargado
    setTimeout(() => this.initializeChart(), 1000);
  }

  loadTopUsers(): void {
    this.cuatrimestreService.getTopUsers().subscribe(
      (data) => {
        this.topUsers = data;
      },
      (error) => {
        console.error('Error al obtener los mejores usuarios:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    // Limpiar el temporizador al salir de la pantalla
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadCalificaciones(userId: number, cuatrimestreNumber: number): void {
    this.cuatrimestreService.getCalificacionesByAlumno(userId, cuatrimestreNumber).subscribe(
      (data) => {
        // Agrupar las calificaciones por materia
        this.calificacionesAgrupadas = this.cuatrimestreService.agruparCalificacionesPorMateria(data);

        // Verificar si no se encontraron calificaciones
        if (this.calificacionesAgrupadas.length === 0) {
          console.log(`No hay calificaciones disponibles para el cuatrimestre ${cuatrimestreNumber}.`);
          // Establecer el promedio de este cuatrimestre como 0
          this.promediosCuatris[cuatrimestreNumber - 1] = 0;
          this.actualizarPromedioGeneral();
          this.actualizarGrafica(); // Asegurar que la gráfica incluya este valor
          return;
        }

        // Calcular el promedio por cuatrimestre
        this.promedioCuatri = this.cuatrimestreService.calcularPromedioGeneral(this.calificacionesAgrupadas);

        // Verificar si el promedio es válido
        if (isNaN(this.promedioCuatri)) {
          console.log(`No se pudo calcular el promedio para el cuatrimestre ${cuatrimestreNumber}. Aún no hay calificaciones.`);
          this.promediosCuatris[cuatrimestreNumber - 1] = 0;
        } else {
          //console.log(`Promedio para el cuatrimestre ${cuatrimestreNumber}: ${this.promedioCuatri}`);
          this.promediosCuatris[cuatrimestreNumber - 1] = this.promedioCuatri;
        }

        this.actualizarPromedioGeneral();
        this.actualizarGrafica(); // Asegurar que la gráfica refleje los valores actualizados
      },
      (error) => {
        if (error.status === 404 && error.error.message === "No se encontraron calificaciones para este alumno en este cuatrimestre") {
          //console.log(`Aún no hay calificaciones para el cuatrimestre ${cuatrimestreNumber}.`);
          this.promediosCuatris[cuatrimestreNumber - 1] = 0;
          this.actualizarPromedioGeneral();
          this.actualizarGrafica();
        } else {
          console.error('Error al obtener calificaciones:', error);
        }
      }
    );
  }

  private actualizarPromedioGeneral(): void {
    // Filtrar los promedios válidos (excluyendo los cuatrimestres con promedio 0)
    const promediosValidos = this.promediosCuatris.filter((promedio) => promedio > 0);

    // Calcular el promedio general solo con promedios válidos
    if (promediosValidos.length > 0) {
      const sumaTotal = promediosValidos.reduce((acc, curr) => acc + curr, 0);
      this.promedioGeneral = sumaTotal / promediosValidos.length;
    } else {
      this.promedioGeneral = 0; // Si no hay promedios válidos, el promedio general es 0
    }

    //console.log(`Promedio general actualizado: ${this.promedioGeneral}`);
  }

  actualizarGrafica() {
    if (this.chartInstance) {
      // Actualiza los datos existentes sin crear una nueva instancia
      this.chartInstance.data.datasets[0].data = [/* Nuevos datos */];
      this.chartInstance.data.labels = [/* Nuevas etiquetas */];
      this.chartInstance.update(); // Actualiza la gráfica
    } else {
      this.initializeChart();
    }
  }

  // Método para inicializar la gráfica
  initializeChart() {
    const ctx = document.getElementById('gradesChart') as HTMLCanvasElement;

    // Si ya existe una instancia, destruirla antes de crear una nueva
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Crear una nueva instancia de la gráfica
    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.promediosCuatris.map((_, index) => `${index + 1}º Cuatri`), // Etiquetas dinámicas
        datasets: [{
          label: 'Promedios por Cuatrimestre',
          data: this.promediosCuatris, // Datos dinámicos
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  updateChartSize() {
    const chart = Chart.getChart('gradesChart'); // Obtener la gráfica
    if (chart) {
      chart.resize(); // Redimensionar la gráfica
    }
  }

  loadCuatrimestres() {
    this.cuatrimestreService.getCuatrimestres(this.userId).subscribe(
      (data: any) => {
        this.cuatrimestres = data;
        // Determinar el cuatrimestre más alto
        this.cuatriLast = Math.max(...this.cuatrimestres.map(cuatrimestre => cuatrimestre.numero));
        //console.log(this.cuatriLast);
        // Una vez cargados los cuatrimestres, iterar sobre ellos
        this.cuatrimestres.forEach(cuatrimestre => {
          //console.log('Cuatrimestre ID:', cuatrimestre.id);  // Aquí debería funcionar
          this.loadCalificaciones(this.userId, cuatrimestre.numero);
        });
      },
      (error) => {
        console.error('Error al cargar cuatrimestres:', error);
      }
    );
  }

  // Método para agregar un nuevo cuatrimestre
  addCuatrimestre(): void {
    // Determina el número del siguiente cuatrimestre a partir de la longitud de la lista actual
    const numeroCuatrimestre = this.cuatrimestres.length + 1;

    // Genera el nombre del cuatrimestre basado en el número
    let nuevoNombre: string;
    switch (numeroCuatrimestre) {
      case 1:
        nuevoNombre = "1er cuatri";
        break;
      case 2:
        nuevoNombre = "2do cuatri";
        break;
      case 3:
        nuevoNombre = "3er cuatri";
        break;
      case 4:
        nuevoNombre = "4to cuatri";
        break;
      case 5:
        nuevoNombre = "5to cuatri";
        break;
      case 6:
        nuevoNombre = "6to cuatri";
        break;
      case 7:
        nuevoNombre = "7mo cuatri";
        break;
      case 8:
        nuevoNombre = "8vo cuatri";
        break;
      case 9:
        nuevoNombre = "9no cuatri";
        break;
      case 10:
        nuevoNombre = "10mo cuatri";
        break;
      case 11:
        nuevoNombre = "11vo cuatri";
        break;
      default:
        nuevoNombre = `${numeroCuatrimestre}vo cuatri`; // Maneja casos adicionales si hay más de 6
    }

    // Llama al servicio para crear el nuevo cuatrimestre
    this.cuatrimestreService.createCuatrimestre(this.userId, nuevoNombre).subscribe((newCuatrimestre: any) => {
      this.cuatrimestres.push(newCuatrimestre); // Añade el nuevo cuatrimestre a la lista
      this.selectedButton = newCuatrimestre.nombre; // Selecciona el cuatrimestre añadido
      this.loadCuatrimestres(); // Carga la lista de cuatrimestres actualizada
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

  goToMateriasPage() {
    if (this.selectedButton) {
      // Usar state para pasar ambos valores
      this.router.navigate(['/calificaciones-materias'], {
        state: {
          id: this.selectedButton,
          numero: this.selectedCuatrimestreNumero,
          ultCuatri: this.cuatriLast
        }
      });
    }
  }

  volver() {
    this.navCtrl.back();
  }
  goToEnglishScorePage() {
    this.router.navigate(['/english-score']);
  
}

}
