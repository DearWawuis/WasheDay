import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { EnglishScoreService } from 'src/app/services/english-score.service';
import { Subscription } from 'rxjs';
import { TabService } from '../../services/tab.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {SimpleLinearRegression} from 'ml-regression-simple-linear';

@Component({
  selector: 'app-english-score',
  templateUrl: './english-score.page.html',
  styleUrls: ['./english-score.page.scss'],
})
export class EnglishScorePage implements OnInit {
  isProfileMenuOpen: boolean = false;
  isLoggedIn: boolean = false;
  userName: string = '';
  userId: number;
  private routerSubscription!: Subscription;
  scores: any[] = [];
  predictedScore: number | null = null;
  scoresNumber: any[] = [];
  levelsEnglish: any = [{
    level: 'A1',
    start: 0,
    end: 199
  },{
    level: 'A2',
    start: 200,
    end: 299
  },{
    level: 'B1',
    start: 300,
    end: 399
  }, {
    level: 'B2',
    start: 400,
    end: 499
  },{
    level: 'C1',
    start: 500,
    end: 599
  },{
    level: 'C2',
    start: 600,
    end: 1000
  },];
  levelNext: string = '';
  alertHeader: string = 'Ingresa el score'; 
  currentScoreId: number | null = null; 
  /*public alertButtons = ['Guardar'];
  public alertInputs = [
    {
      type: 'number',
      placeholder: 'Score',
      min: 1,
      max: 1000,
    }
  ];*/
  

  constructor(
    private authService: AuthService,
    private router: Router,
    public tabService: TabService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertController: AlertController,
    private modalController: ModalController,
    private englishScoreService: EnglishScoreService
  ) {
    this.userName = this.authService.getUserName();
    this.userId = this.authService.getUserId();
    this.isLoggedIn = !!this.userName;
   }

  ngOnInit() {
    this.loadScores();
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeProfileMenu();
        console.log(this.userId);
      }
    });
    //this.predictNextLevel(this.scores);
    console.log(this.levelsEnglish);
  }

  loadScores() {
    this.englishScoreService.getScoreByUser(this.userId).subscribe((data) => {
      this.scores = data.results; 
      this.scoresNumber = [];
      
      this.scores.forEach((score, index) => { 
        for(var a=0; a < this.levelsEnglish.length; a++){
          if(score.score >= this.levelsEnglish[a].start && score.score <= this.levelsEnglish[a].end){
            this.scores[index].level = this.levelsEnglish[a].level
            console.log('AGREGA');
          }
        }
        //Anadir los numeros de score a un arreglo para predecir
        this.scoresNumber.push(score.score);
      })
      console.log(this.scores);
      console.log('numbers: '+this.scoresNumber);
      if (this.scoresNumber.length >= 2) {
        this.predictedScore = this.predictNextLevel(this.scoresNumber);
        for(var a=0; a < this.levelsEnglish.length; a++){ //Calcular el nivel de prediccion
          if(this.predictedScore >= this.levelsEnglish[a].start && this.predictedScore <= this.levelsEnglish[a].end){
            this.levelNext = this.levelsEnglish[a].level
          }
        }
      } else {
        console.error('Se necesitan al menos 2 puntajes para realizar la predicción.');
      }

    });
  }

  predictNextLevel(scores: number[]): number {
    // Aquí debes implementar la lógica para construir el modelo de regresión lineal
  
    // Creamos los datos X (índices) e Y (puntajes) para la regresión lineal
    const X = scores.map((_, index) => index + 1); // [1, 2, 3, ...]
    const Y = scores;
  
    // Crea el modelo de regresión lineal
    const regression = new SimpleLinearRegression(X, Y);
  
    // Predecimos el siguiente valor (X.length + 1, es decir, el siguiente índice)
    const nextIndex = X.length + 1;
    const predictedScore = regression.predict(nextIndex);
  
    return predictedScore;
  }
  

  getBadgeClass(level: string): string {
    if (level === 'A1' || level === 'A2') {
      return 'ion-badge-a'; 
    } else if (level === 'B1' || level === 'B2') {
      return 'ion-badge-b'; 
    } else if (level === 'C1' || level === 'C2') {
      return 'ion-badge-c';  
    } else {
      return '';  
    }
  }

  getImageSrc(level: string): string {
    if (level === 'A1') {
      return 'assets/images/a1.jpg';  
    } else if (level === 'A2') {
      return 'assets/images/a2.jpg';  
    } else if (level === 'B1') {
      return 'assets/images/b1.jpg';  
    } else if (level === 'B2') {
      return 'assets/images/b2.jpg';  
    } else if (level === 'C1') {
      return 'assets/images/c1.jpg'; 
    } else if (level === 'C2') {
      return 'assets/images/c2.jpg';  
    } else {
      return 'assets/images/default.jpg'; 
    }
  }

  async addScore() {
    this.alertHeader = 'Ingresa el score';  // Título para agregar score
    this.currentScoreId = null;  // No hay score seleccionado, estamos agregando uno nuevo
    
    const alert = await this.alertController.create({
      header: this.alertHeader,
      inputs: [
        {
          name: 'score',
          type: 'number',
          placeholder: 'Score',
          min: 1,
          max: 1000,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.saveScore(data.score);
          },
        },
      ],
    });
    await alert.present();
  }
  
  async editScore(score: any) {
    this.alertHeader = 'Editar score';  // Título para editar el score
    this.currentScoreId = score.id;  // Guardamos el ID del score a editar
    
    const alert = await this.alertController.create({
      header: this.alertHeader,
      inputs: [
        {
          name: 'score',
          type: 'number',
          value: score.score,  // Pre-poblamos el score actual
          placeholder: 'Score',
          min: 1,
          max: 1000,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.saveScore(data.score);
          },
        },
      ],
    });
    await alert.present();
  }

  saveScore(scoreValue: number) {
    console.log(this.currentScoreId+' c/c '+scoreValue);
    if (this.currentScoreId) {
      // Si existe un Id, se esta editando un score
      this.englishScoreService.updateScore(this.currentScoreId, scoreValue).subscribe((response) => {
        this.loadScores();  // Recargamos los scores después de la actualización
      });
    } else {
      // Si no existe un Id, se esta agregando un nuevo score
      this.englishScoreService.addScore(scoreValue, this.userId).subscribe((response) => {
        this.loadScores();  // Recargamos los scores después de agregar uno nuevo
      });
    }
  }
  

  async confirmDelete(score: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el score ${score.score}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteScore(score.id);  // Llamar a la función para eliminar el score
          },
        },
      ],
    });

    await alert.present();
  }

  deleteScore(scoreId: number) {
    this.englishScoreService.deleteScore(scoreId).subscribe(
      () => {
        this.loadScores();
      },
      (error) => {
        console.error('Error al eliminar el score:', error);
      }
    );
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
