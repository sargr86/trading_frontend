import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    owlOptions = OWL_OPTIONS;
    videos = [];
    apiUrl = API_URL;

    constructor(
        private videoService: VideoService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.videoService.get({}).subscribe(dt => {
            this.videos = dt;
        });
    }


    openVideoPage(video, username) {
        // console.log(username);
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

}
