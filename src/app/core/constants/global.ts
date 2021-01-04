import {OwlOptions} from 'ngx-owl-carousel-o';
import {environment} from '@env';


export const API_URL = environment.apiUrl;
export const VIDEO_DEFAULT_THUMBNAIL_PATH = 'assets/img/video-thumbnail-default.png';

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

export const NAVBAR_ADDITIONAL_LINKS = [
    {name: 'Accessibility assessment', link: 'accessibility-assessment'},
    {name: 'About Metl', link: 'about'},
    {name: 'Contact us', link: 'contact-us'},
    {name: 'Help', link: 'help'},
    {name: 'METL.TV security', link: 'security'},
    {name: 'Privacy policy', link: 'privacy-policy'},
    {name: 'Cookie policy', link: 'cookie-policy'},
];

export const VIDEO_CATEGORIES = ['Stock', 'Etf', 'Cryptocurrency'];

export const ALLOWED_IMG_MIME_TYPES = ['image/jpeg', 'image/png'];

export const PASSWORD_MAX_LENGTH = 15;
export const PASSWORD_MIN_LENGTH = 6;
