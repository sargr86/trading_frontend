import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  owlOptions: OwlOptions = {
    loop: true,
    // margin: 10,
    nav: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class=\'fa fa-chevron-left\'></i>', '<i class=\'fa fa-chevron-right\'></i>'],
    responsive: {
      0: {
        items: 1
      },
      767: {
        items: 3
      },
      1200: {
        items: 3
      }
    }
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
