import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})
export class TabBarComponent implements OnInit {
  constructor(
    private menuCtrl: MenuController, 
    private router: Router
  ) {}

  ngOnInit() {}

  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  closeMenu() {
    this.menuCtrl.close();
  }
}
