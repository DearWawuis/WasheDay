import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home-washer',
  templateUrl: './home-washer.page.html',
  styleUrls: ['./home-washer.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomeWasherPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
