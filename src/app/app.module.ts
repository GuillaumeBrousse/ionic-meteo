import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import {WeatherService} from '../services/WeatherService';
import {ChartComponent} from '../components/ChartComponent';

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    HomePage,
    TabsPage,
    ChartComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    HomePage,
    TabsPage
  ],
  providers: [WeatherService, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
