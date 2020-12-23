import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {Router} from '@angular/router';

@Component({
    selector: 'app-videos-tab',
    templateUrl: './videos-tab.component.html',
    styleUrls: ['./videos-tab.component.scss']
})
export class VideosTabComponent implements OnInit {

    owlOptions: OwlOptions = OWL_OPTIONS;
    apiUrl = API_URL;

    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    constructor(
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

    openVideoPage(video, username) {
        console.log(username);
        let route;
        let params;
        if (video.status === 'live') {
            route = 'user/video/watch';
            params = {session: video.session_name, publisher: username};
        } else {
            route = 'videos/play';
            params = {id: video.id};
        }


        this.router.navigate([route], {queryParams: params});
    }

    getSearchResults(dt) {
        this.channelUser.videos = dt;
    }

}
