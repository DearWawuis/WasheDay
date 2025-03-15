import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabBarComponent implements OnInit {
  showTabs: boolean = false;

  constructor(private menuCtrl: MenuController, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url.includes('login') || event.url.includes('register')) {
          this.showTabs = false; 
        } else {
          this.showTabs = true; 
        }
      }
    });
  }

  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  closeMenu() {
    this.menuCtrl.close();
  }
}
