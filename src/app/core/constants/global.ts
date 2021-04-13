import {OwlOptions} from 'ngx-owl-carousel-o';
import {environment} from '@env';
import * as moment from 'moment';


export const API_URL = environment.apiUrl;
export const VIDEO_DEFAULT_THUMBNAILS_PATH = 'assets/img/video-thumbnail-default.png';
export const VIDEO_DEFAULT_COVERS_PATH = 'assets/img/default-thumbnail.png';
export const VIDEO_DEFAULT_AVATARS_PATH = 'assets/img/default-user.png';
export const USER_DEFAULT_AVATARS_PATH = 'assets/img/default-user.png';
export const DEFAULT_VIDEO_SUGGESTIONS_COUNT = 5;


export const OWL_OPTIONS: OwlOptions = {
    loop: false,
    margin: 25,
    nav: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class=\'fa fa-chevron-left\'></i>', '<i class=\'fa fa-chevron-right\'></i>'],
    responsive: {
        0: {
            items: 1
        },
        516: {
            items: 2
        },
        867: {
            items: 3.05
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

export const DEVICES_ICONS = [
    {
        name: 'webcam', messages: [
            {type: 'error', msg: 'Can\'t find camera. Make sure it\'s connected and try again', icon: 'videocam_off'},
            {type: 'success', msg: 'Camera is connected', icon: 'checked'}
        ]
    },
    {
        name: 'microphone', messages: [
            {type: 'error', msg: 'Can\'t find microphone. Make sure it\'s connected and try again', icon: 'mic_off'},
            {type: 'success', msg: 'Microphone is connected', icon: 'checked'}
        ]
    }
]


export const VIDEO_FILTERS = [
    {
        group: {name: 'Upload Date', value: 'date'}, items: [
            {name: 'Last hour', value: moment().utc().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss')},
            {name: 'Today', value: moment().startOf('day').format('YYYY-MM-DD')},
            {name: 'This week', value: moment().startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')},
            {name: 'This month', value: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')},
            {name: 'This year', value: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss')},
        ]
    },

    {
        group: {name: 'Duration', value: 'duration'}, items: [
            {name: 'Short (<= 30 seconds)', value: 'short'},
            {name: 'Long (>30 seconds and <1 hour)', value: 'long'},
        ]
    }

];

export const STOCK_CATEGORIES = [
    {name: 'Stocks', value: 'stocks'},
    {name: 'ETF', value: 'etf'},
    {name: 'Forex', value: 'forex'},
    {name: 'Cryptocurrency', value: 'crypto'},
];

export const DESCRIPTION_CHARACTERS_LIMIT = 100;

export const MAIN_SECTIONS = [
    {name: 'Start live video', img: '', icon: 'video_call', link: '/user/video/start-live-video', auth: true, production: true},
    {name: 'Home', img: '', icon: 'home', link: '/', auth: false, production: true},
    {name: 'Trending', img: 'item-9', icon: '', link: '/trending', separator: true, auth: false, production: true},
    {name: 'Messages', img: 'item-8', icon: '', link: '/chat/messages', production: false, auth: true},
    {name: 'Chat rooms', img: 'item-8', icon: '', link: '/chat/rooms', separator: true, production: false, auth: true},
    {name: 'Saved videos', img: 'item-11', icon: '', link: '/videos/saved',  production: true, auth: true},
    {name: 'Videos', img: 'item-11', icon: '', link: '/videos', auth: true, separator: true, production: true},
    {name: 'Analytics', img: 'item-9', icon: '', link: '/stocks/analytics', auth: true, production: true},
];
