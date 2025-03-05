import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home-washo',
  templateUrl: './home-washo.page.html',
  styleUrls: ['./home-washo.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomeWashoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
