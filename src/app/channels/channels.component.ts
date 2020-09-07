import {Component, OnInit} from '@angular/core';
import {CHART_1, CHART_2, CHART_3, CHART_4} from '../core/constants/charts';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  canvas: any;
  ctx: any;
  lineChart;

  constructor() {



  }

  ngOnInit(): void {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    this.lineChart = new Chart(this.ctx, CHART_1);

    this.canvas = document.getElementById('myChart2');
    this.ctx = this.canvas.getContext('2d');
    this.lineChart = new Chart(this.ctx, CHART_2);

    this.canvas = document.getElementById('myChart3');
    this.ctx = this.canvas.getContext('2d');
    this.lineChart = new Chart(this.ctx, CHART_3);

    this.canvas = document.getElementById('myChart4');
    this.ctx = this.canvas.getContext('2d');
    this.lineChart = new Chart(this.ctx, CHART_4);
  }

}
