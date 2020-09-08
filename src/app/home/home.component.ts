import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {OWL_OPTIONS} from '../core/constants/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  owlOptions = OWL_OPTIONS;

  constructor() {
  }

  ngOnInit(): void {
  }

}
