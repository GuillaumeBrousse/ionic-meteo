import { Component, Directive, ElementRef, Input , OnDestroy, OnInit, OnChanges,} from '@angular/core';
 
declare var Chart:any;
 
@Component({
  selector: 'graphique-ligne',
  template: `<canvas width="400" height="250"></canvas>`
})
 
export class ChartComponent implements  OnChanges, OnInit, OnDestroy{
 
  @Input() labels: string[];
  @Input() data: number[];
 
  private elementRef:ElementRef;
  private canvas:any;
  private chart:any;
 
  public constructor(el: ElementRef){
    this.elementRef = el;
  }
 
  public ngOnInit(){
    this.canvas = this.elementRef.nativeElement.children[0];
  }
 
  public ngOnChanges(){
    if(this.data && this.labels){
      this._create();
    }
  }
 
  public ngOnDestroy(){
    if(this.chart){
      this.chart.destroy();
      this.chart=null;
    }
  }
 
  private _create(){
 
    this.ngOnDestroy();
 
    let line = this._constructLineChart(this.data);
    line.data.datasets[0].data = this.data;
    line.data.labels = this.labels;
 
    this.chart = new Chart(this.canvas, line)
  }
 
  private _constructLineChart(datas:number[]){
    return {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: 'temperature.',
              data:  [],
              fontColor: "white",
              //borderColor: "rgba(75,192,192,1)",
              borderColor: "white",
              backgroundColor:'#4078d1',
              borderWidth:3
          }]
      },
      options:{
        legend: {
            labels: {
                fontColor: 'white'
            }
        },
        scales:{
          yAxes:[{
            ticks:{
              fontColor: "white",
              max:Math.max.apply(Math, datas)+1
            },
            gridLines: {
                display:true
            }
          }],
          xAxes:[{
            ticks:{
              fontColor: "white"
            },
            gridLines: {
                display:false
            }
          }]
        }
      }
    };
  }
}