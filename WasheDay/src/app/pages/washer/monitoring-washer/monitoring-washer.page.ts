import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-monitoring-washer',
  templateUrl: './monitoring-washer.page.html',
  styleUrls: ['./monitoring-washer.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MonitoringWasherPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
