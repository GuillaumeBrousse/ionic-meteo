import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {WeatherService} from '../../services/WeatherService';
 
declare var google;


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
 
  @ViewChild('map') mapElement: ElementRef;

  static dataJSON: any;
  static map: any;
  static geoJSON: any;
  static weatherMap : WeatherService;

  constructor(private weather: WeatherService){
    MapPage.weatherMap = weather;
  }
  
  ionViewDidLoad(){
    google.maps.event.addDomListener(window, 'load', this.loadMap());
  }

  loadMap(){
    let infowindow = new google.maps.InfoWindow();
    let latLng = new google.maps.LatLng(46.227638, 2.213749);
    let mapOptions = {
      center: latLng,
      zoom: 8,
      //mapTypeId: google.maps.MapTypeId.TERRAIN,
      mapTypeId: 'satellite',
      disableDefaultUI: true
    }
    MapPage.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
    google.maps.event.addListener(MapPage.map, 'idle', function(){
      let northLat = this.getBounds().getNorthEast().lat(),
          eastLng  = this.getBounds().getNorthEast().lng(), 
          southLat = this.getBounds().getSouthWest().lat(), 
          westLng  = this.getBounds().getSouthWest().lng();
    // Make the weather request
      MapPage.weatherMap.getWeatherMap(westLng,northLat,eastLng,southLat,this.getZoom()).subscribe(data => {
          MapPage.dataJSON = data.list;
          MapPage.resetData();
          for (let data of MapPage.dataJSON) {
              MapPage.geoJSON.features.push(MapPage.jsonToGeoJson(data));
          }
          console.log(MapPage.geoJSON)
          MapPage.drawIcons(MapPage.geoJSON);
      });
    });
    MapPage.map.data.addListener('click', function(event) {
      infowindow.setContent(
         "<table class='table table-condensed'><thead><tr><th colspan='2'>"      + event.feature.getProperty("city")        + " </strong><img width='50%' src="+event.feature.getProperty("icon")+"></th></tr></thead>"
       + "<tr class='tr-inverse'><td>TEMPERATURE</td><td align='right'><strong> "+ event.feature.getProperty("temperature") + " &deg;C</strong></td></tr>"
       + "<tr class='tr-inverse'><td>TEMPS</td><td align='right'><strong> "      + event.feature.getProperty("weather")     + " </strong></td></tr>"
       + "<tr class='tr-inverse'><td>HUMIDITE</td><td align='right'><strong> "   + event.feature.getProperty("humidity")    + " </strong></td></tr>"
       + "<tr class='tr-inverse'><td>PRESSION</td><td align='right'><strong> "   + event.feature.getProperty("pressure")    + " hPa </strong></td></tr>"
       + "<tr class='tr-inverse'><td>VITESSE DU VENT</td><td align='right'><strong> " + event.feature.getProperty("windSpeed")   + " m/s</strong></td></tr>"
       + "</table>"
       );
      infowindow.setOptions({
          position:{
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          },
          pixelOffset: {
            width: 0,
            height: -15
          }
        });
      infowindow.open(this.map);
    });
  }

  // For each result that comes back, convert the data to geoJSON
  static jsonToGeoJson(weatherItem) {
    console.log(weatherItem)
    let feature = {
      type: "Feature",
      properties: {
        city: weatherItem.name,
        weather: weatherItem.weather[0].main,
        temperature: weatherItem.main.temp,
        min: weatherItem.main.temp_min,
        max: weatherItem.main.temp_max,
        humidity: weatherItem.main.humidity,
        pressure: weatherItem.main.pressure,
        windSpeed: weatherItem.wind.speed,
        windDegrees: weatherItem.wind.deg,
        windGust: weatherItem.wind.gust,
        icon: "http://openweathermap.org/img/w/"+weatherItem.weather[0].icon+".png",
        // ===================================================================================================================== //
        // ===================================================================================================================== //
        // ====================== METTRE LA LIGNE EN COMMENTAIRE SI AUCUNE DONNE SAFFICHE SUR LA CARTE ========================= //
        //coordinates: [weatherItem.coord.lon, weatherItem.coord.lat],
        // ========================== Decommenter LA LIGNE SI AUCUNE DONNE SAFFICHE SUR LA CARTE =============================== //
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat], 
        // ===================================================================================================================== //
        // ===================================================================================================================== //
        html: ["<div>", '<span class="city-bullet"></span>',
         '<div class="city-data">',
          '<div class="row city-main-info">',
          '<span class="city-weather">' + weatherItem.main.temp + " </span>", '<span class="city-name">' + weatherItem.name + "</span>", "</div>", '<div class="row city-full-info">',
          "<table>", "<thead>", "<tr>", '<th colspan=2 class="city-param">' + weatherItem.name + "</td>", "</tr>", "</thead>", "<tbody>", 
          "<tr>", '<td class="city-param-name">Ville</td>','<td class="city-param">' + weatherItem.main.temp + "ºC</td>", "</tr>", 
          "<tr>", '<td class="city-param-name">clouds</td>','<td class="city-param">' + weatherItem.weather[0].main + "%</td>", "</tr>", 
          "<tr>", '<td class="city-param-name">Humidité</td>','<td class="city-param">' + weatherItem.main.humidity + "%</td>", "</tr>", 
          "<tr>", '<td class="city-param-name">Pression</td>','<td class="city-param">' + weatherItem.main.pressure + "hPa</td>", "</tr>", 
          "<tr>", '<td class="city-param-name">Direction du vent</td>','<td class="city-param">' + weatherItem.wind.deg + "°</td>", "</tr>", 
          "<tr>", '<td class="city-param-name">Vitesse du vent</td>','<td class="city-param">' + weatherItem.wind.speed + "m/s</td>", "</tr>", 
          "</tbody>", "</table>", "</div>", "</div>", "</div>"]
      },
      geometry: {
        type: "Point",
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
      }
    };
    // Set the custom marker icon
    this.map.data.setStyle(function(feature) {
      return {
        icon: {
          url: feature.getProperty('icon'),
          anchor: new google.maps.Point(25, 25),
          labelOrigin: new google.maps.Point(25, 0)
        },
        label: {
          color: "white",
          fontFamily: "Roboto,sans-serif",
          fontSize: "16px",
          //fontWeight: "bold",
          text: feature.getProperty('city') + ' ' + feature.getProperty('temperature') +'°C'
        }
      };
    });
    // returns object
    return feature;
  }
  // Add the markers to the map
  static drawIcons(weather) {
     MapPage.map.data.addGeoJson(MapPage.geoJSON);
     // Set the flag to finished
  }
  // Clear data layer and geoJSON
  static resetData() {
    MapPage.geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    MapPage.map.data.forEach(function(feature) {
      MapPage.map.data.remove(feature);
    });
  }
}


