import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router'; // Importa Router para redireccionar
import { Subscription } from 'rxjs';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarService } from '../../services/calendar.service';
import { ModalController } from '@ionic/angular';
import { CalendarModalComponent } from 'src/app/components/calendar-modal/calendar-modal.component';
import { Browser } from '@capacitor/browser';
import { WebviewModalComponent } from 'src/app/components/webview-modal/webview-modal.component';

import { TabService } from '../../services/tab.service';

//Ejemplo de comentario para Github en la rama Main

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  isProfileMenuOpen: boolean = false; // Controlar si el menú está abierto o cerrado
  isLoggedIn: boolean = false;
  userName: string; // Variable para almacenar el nombre del usuario
  userId: number;
  today: string;
  events: any[] = []; //Para guardar los eventos que carga en OnInit
  private routerSubscription!: Subscription; // Suscripción a eventos de navegación

  //Configurar las opciones del calendario Fullcalendar
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', //Vista mensual
    firstDay: 0,  //El primer dia de la semana sea domingo
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale, //Cambio de idioma
    events: this.events, //Asignar eventos iniciales
    //Eventos al darle click a las fechas o eventos del usuario (abril la modal de Detalles)
    dateClick: (arg) => this.handleDateClick(arg),
    eventClick: (arg) => this.handleEventClick(arg),
    datesSet: () => {
      // Llama la funcion applyEventStyles() cada vez que se cambia la vista
      setTimeout(() => {
        this.applyEventStyles();
      }, 0);
    },
    headerToolbar: { //Botones del calendario
      left: 'title',
      right: 'prev,next'
    }
  };

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para redireccionar
    public tabService: TabService,
    private calendarService: CalendarService, //Para llamar los servicios de calendario
    private renderer: Renderer2, //Sirve para poder manipular el DOM para los colores y disenos del calendario
    private modalController: ModalController  //Controlador de modales
  ) {
    // Inicializar el nombre del usuario y el estado de autenticación
    this.userName = this.authService.getUserName(); // Método para obtener el nombre del usuario
    this.isLoggedIn = !!this.userName; // Comprobar si el usuario está autenticado
    this.userId = this.authService.getUserId(); //Obtener el ID del usuario para peticiones en los servicios
    const date = new Date();
    this.today = date.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadUserData(); //Cargar datos del usuario
    this.loadEvents(); //Cargar eventos generales y del usuario
    this.subscribeToRouterEvents();

    //Suscribe al cierre de la modal, cargar nuevamente los datos
    this.calendarService.modalClosed$.subscribe(() => {
      this.loadEvents();
    });

    // Forzar recarga del calendario después de un pequeño retraso
    setTimeout(() => {
      this.refreshCalendar();
    }, 100); // El tiempo en ms puede ajustarse si es necesario
  }

  // Función para refrescar el calendario
  refreshCalendar() {
    this.calendarOptions = { ...this.calendarOptions }; // Esto fuerza una actualización del calendario
    setTimeout(() => {
      this.applyEventStyles(); // Volver a aplicar los estilos después de actualizar
    }, 0);

    console.log("Recargando calendario");
  }

  // Carga datos del usuario
  private loadUserData() {
    this.userName = this.authService.getUserName();
    this.userId = this.authService.getUserId();
    this.isLoggedIn = !!this.userName;
  }

  // Suscripción a eventos de navegación
  private subscribeToRouterEvents() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeProfileMenu();
        this.loadUserData();
        this.loadEvents();
      }
    });
  }

  //La sig funcion carga los eventos del servicio
  loadEvents() {
    this.calendarService.getEvents(this.userId).subscribe((data) => {
      // Mapear el contenido de events
      this.events = data.map((event: any) => {
        let endDate = event.end === '0000-00-00' ? new Date(event.start) : new Date(event.end);
        if (endDate) {
          endDate.setDate(endDate.getDate() + 1); //Aumentar un dia debido a las zonas horarias para vista en celda
        }
        let startDate = new Date(event.start);

        startDate.setDate(startDate.getDate() + 1); //Aumentar un dia debido a las zonas horarias para vista en celda

        return { //Se hacen ciertas validaciones para el establecer la informacion en 
          //las celfas del fullcalenbdar  (relleno = 7 > son eventos del propio usuario)
          title: event.relleno === 7 ? event.nombre_evento : '',
          start: event.relleno === 7 ? startDate : new Date(event.start), // Asegúrate de que el formato sea correcto
          end: endDate,
          backgroundColor: event.relleno === 7 ? event.backgroundColor : 'transparent',
          colorBD: event.backgroundColor,
          display: event.display,
          relleno: event.relleno,
          textColor: event.display === 'sn' ? '' : event.textColor
        };
      });

      // Actualizar las opciones del calendario
      this.calendarOptions.events = this.events;
      //Una vez que se genera el array de events con sus respectivos datos,
      //Procedemos a plicar los estilos con applyEventStyles
      setTimeout(() => {
        this.applyEventStyles();
      }, 10);
    }, (error) => {
      console.error('Error al cargar los eventos:', error);
    });
  }

  //Funcion para abril la modal al presionar una fecha, pasando dos parametros para la consulta
  handleDateClick(arg: any) {
    this.presentModal(arg.dateStr, this.userId)
  }
  //Funcion para abril la modal al presionar un evento, pasando dos parametros para la consulta
  handleEventClick(arg: any) {
    const eventDate = new Date(arg.event.start);
    this.presentModal(eventDate.toLocaleDateString('en-CA'), this.userId);
  }

  //Funcion para mostrar modal de DETALLES cuando se presiona fecha o algun evento del usuario
  async presentModal(date: string, id: number) {
    const modal = await this.modalController.create({
      component: CalendarModalComponent,
      componentProps: { date: date, userId: id } //Se pasan estos parametros al calendar-modal.component
    });

    return await modal.present();
  }

  //Funcion para aplicar estilos a los eventos
  applyEventStyles() {
    this.events.forEach(event => {
      //Definir valores iniciales (fechas)
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : start; //Si el evento tiene un rango de fechas
      const inclusiveEnd = new Date(end);
      inclusiveEnd.setDate(inclusiveEnd.getDate());

      if (start <= inclusiveEnd) {
        let d = new Date(start);
        let index = 0; //Controlar de posiciones para rango de fechas

        while (d < inclusiveEnd) {
          const dateStr = d.toISOString().split('T')[0];
          const cell = document.querySelector(`.fc-day[data-date="${dateStr}"]`); //Seleccionar la celda del calendario
          if (cell) {
            const dateNumber = cell.querySelector('.fc-daygrid-day-number');
            this.renderer.setStyle(dateNumber, 'color', event.textColor); //Aplicar color al numero de la celda

            // Aplicar estilos según el valor de event.relleno
            if (event.relleno === 0) { //Cuando el evento debe llevar border
              if (index === 0) { //Si es el primer dia del rango, se le aplica border left, top y bottom
                this.renderer.setStyle(cell, 'boxShadow', `inset 3px 0 0 0 ${event.colorBD}, inset 0 -3px 0 0 ${event.colorBD}, inset 0 3px 0 0 ${event.colorBD}`);
              } else if (index === (inclusiveEnd.getTime() - start.getTime()) / (24 * 60 * 60 * 1000) - 1) { //Si es el ultimo dia del rango, se le aplica border right, top y bottom
                this.renderer.setStyle(cell, 'boxShadow', `inset -3px 0 0 0 ${event.colorBD}, inset 0 -3px 0 0 ${event.colorBD}, inset 0 3px 0 0 ${event.colorBD}`);
              } else { //Si esta entre el rango, solo aplicar border top y bottom
                this.renderer.setStyle(cell, 'boxShadow', `inset 0 -3px 0 0 ${event.colorBD}, inset 0 3px 0 0 ${event.colorBD}`);
              }

            } else if (event.relleno > 0 && event.relleno < 3) { //Cuando el evento lleva relleno por completo
              this.renderer.setStyle(cell, 'backgroundColor', event.colorBD);//Aplicar el fondo


            } else if (event.relleno === 4 || event.relleno === 5) { //Cuando el evento es inicio o fin de alguna fecha, pintar un icono
              const icon_type = event.relleno === 4 ? 'caret-forward-outline' : 'caret-back-outline'; //Establercer que inoco de ionic tendra la celda
              const icon = document.createElement('ion-icon');
              icon.setAttribute('name', icon_type);
              //Definir estilos para el icono
              this.renderer.setStyle(icon, 'font-size', '50px');
              this.renderer.setStyle(icon, 'color', event.colorBD);
              this.renderer.setStyle(icon, 'position', 'absolute');
              this.renderer.setStyle(icon, 'top', '50%');
              this.renderer.setStyle(icon, 'left', '50%');
              this.renderer.setStyle(icon, 'transform', 'translate(-50%, -50%)');
              this.renderer.setStyle(icon, 'pointer-events', 'none');
              this.renderer.setStyle(cell, 'position', 'relative');
              cell.appendChild(icon);
            } else if (event.relleno === 6) { //Cuando el evento debe llevar lineas horizontales
              const numberOfLines = 5; // Número de líneas
              const lineSpacing = 20; // Espacio entre líneas que sera en porcentaje para que se ajuste a diferentes pantallas

              for (let i = 0; i < numberOfLines; i++) {
                const line = document.createElement('div');
                this.renderer.setStyle(line, 'position', 'absolute');
                this.renderer.setStyle(line, 'left', '0');
                this.renderer.setStyle(line, 'top', `${i * lineSpacing}%`);
                this.renderer.setStyle(line, 'width', '100%');
                this.renderer.setStyle(line, 'height', '5px');
                this.renderer.setStyle(line, 'backgroundColor', event.colorBD);
                this.renderer.setStyle(cell, 'position', 'relative');
                cell.appendChild(line);
              }
            }
            if (d.getDay() === 6) { //Las funciones anteriores marcan todo el rango de eventos, sin embargo, los domingos no debe tener nada, entonces se le coloca un fonto
              this.renderer.setStyle(cell, 'backgroundColor', 'transparent');
            }

          }
          //Aumentar fecha y el controlador de posiciones
          d.setDate(d.getDate() + 1);
          index++;
        }
      }
    });
  }

  async openWebModalUteq() {
    const modal = await this.modalController.create({
      component: WebviewModalComponent,
      componentProps: { url: 'https://alumnos.uteq.edu.mx/' }
    });
    await modal.present();
  }

  async openWebModalLizard() {
    const modal = await this.modalController.create({
      component: WebviewModalComponent,
      componentProps: { url: 'https://lizard.uteq.edu.mx/pub/alumnos.php' }
    });
    await modal.present();
  }
  
  async openWebViewLizard() {
    await Browser.open({ url: 'https://lizard.uteq.edu.mx/pub/alumnos.php' });
  }

  async openWebViewUteq() {
    await Browser.open({ url: 'https://alumnos.uteq.edu.mx/' });
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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