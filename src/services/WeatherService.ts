import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 
 
@Injectable()
export class WeatherService {
 
  private _appid = '3bd691fa0ea2d783a77753f736908066';
 
  constructor(private http: Http) { }
 
  public getWeather(url: string, city: string): Observable<any> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/${url}${city}&mode=json&units=metric&lang=fr&APPID=${this._appid}`)
      .map(hours => hours.json());
  } 
  public getWeatherMap(westLng: string,northLat: string,eastLng: string,southLat: string,Zoom: string): Observable<any> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/box/city?bbox=${westLng},${northLat},${eastLng},${southLat},${Zoom}&cluster=yes&format=json&APPID=${this._appid}`)
    	.map(res => res.json());
  }
}