import {OwlOptions} from 'ngx-owl-carousel-o';
import {environment} from '../../../environments/environment';


export const API_URL = environment.apiUrl;

export const OWL_OPTIONS: OwlOptions = {
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
};
