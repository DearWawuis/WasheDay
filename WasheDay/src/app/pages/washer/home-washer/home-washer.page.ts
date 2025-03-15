import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home-washer',
  templateUrl: './home-washer.page.html',
  styleUrls: ['./home-washer.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomeWasherPage implements OnInit {
  isProfileMenuOpen: boolean = false;

  menuVisible= false;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
  // Alternar el estado de apertura/cierre del menú de perfil
  toggleProfileMenu() {
 
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
  // Cerrar el menú de perfil
  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }
connect(){
  this.router.navigate(['/monitoring-washer']);
}
}
