import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {OWL_OPTIONS} from '../../core/constants/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  owlOptions: OwlOptions = OWL_OPTIONS;

  constructor() {
  }

  ngOnInit(): void {
  }

}
