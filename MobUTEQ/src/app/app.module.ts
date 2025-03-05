import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { FullCalendarModule } from '@fullcalendar/angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { MateriaModalComponent } from './components/materia-modal/materia-modal.component';
import { WebviewModalComponent } from './components/webview-modal/webview-modal.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  declarations: [AppComponent, MateriaModalComponent, WebviewModalComponent, SafeUrlPipe],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, HttpClientModule, FullCalendarModule, GoogleMapsModule, FormsModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
