import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importamos el tab-bar
import { TabBarComponent } from './components/tab-bar/tab-bar.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    GoogleMapsModule,
    TabBarComponent
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
