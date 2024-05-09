import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import mapboxgl, { LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker
}
interface PlainMarker {
  color: string;
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent implements AfterViewInit {

  @ViewChild('map')
  public divMap?: ElementRef;

  public markers: MarkerAndColor[] = []

  public map?: mapboxgl.Map;
  public zoom: number = 13;
  public currentLngLat: LngLat = new LngLat(-5.92417, 37.16311);

  ngAfterViewInit(): void {

    if( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.readFromLocalStorage();
    /*
    const markerHTML = document.createElement("DIV");
    markerHTML.innerHTML = "Manuel Esteban";
    const marker = new Marker({
      //color: 'red'
      element: markerHTML
    })
      .setLngLat( this.currentLngLat )
      .addTo( this.map );
    */

  }

  clickAddMarker() {
    if( !this.map ) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();
    this.addMarkers( lngLat, color);
  }

  addMarkers ( lngLat: LngLat, color: string ) {
    const marker = new Marker ({
      color: color,
      draggable: true
    })
      .setLngLat( lngLat )
      .addTo( this.map! );

    this.markers.push({
      color: color,
      marker: marker
    });

    marker.on('dragend', (e) => {
      this.saveToLocalStorage();
    });

    this.saveToLocalStorage();
  }

  deleteMarker( index: number ){
    this.markers[index].marker.remove();
    this.markers.splice( index, 1);

    this.saveToLocalStorage();
  }

  flyTo( marker: Marker ) {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    })
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map( colorMarker => {
      return {
        color: colorMarker.color,
        lngLat: colorMarker.marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ));

  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString ); //! OJO plainMarkersString podria no tener esas propiedades de la interface

    plainMarkers.forEach( plainMarker => {
      const [ lng, lat ] = plainMarker.lngLat;
      const lngLatCoords = new LngLat( lng, lat);
      this.addMarkers( lngLatCoords, plainMarker.color );
    });
  }

}
