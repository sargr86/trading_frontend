import {OwlOptions} from 'ngx-owl-carousel-o';
import {environment} from '@env';


export const API_URL = environment.apiUrl;
export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const OWL_OPTIONS: OwlOptions = {
  loop: false,
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

export const PROFILE_PAGE_TABS = [
  {name: 'Watchlist', link: 'pWatch'},
  {name: 'Videos', link: 'pVideos'},
  {name: 'Playlists', link: 'pPlaylists'},
  {name: 'About', link: 'pAbout'},
];
