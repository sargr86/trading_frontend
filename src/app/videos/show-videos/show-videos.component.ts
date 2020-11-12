import {Component, Input, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import * as moment from 'moment';
import {ActivatedRoute, ActivationEnd, Data, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {ChannelsService} from '@core/services/channels.service';
import {filter, map, tap} from 'rxjs/operators';

@Component({
    selector: 'app-show-videos',
    templateUrl: './show-videos.component.html',
    styleUrls: ['./show-videos.component.scss']
})
export class ShowVideosComponent implements OnInit {
    videos = [];
    channelsVideos = [];
    apiUrl = API_URL;
    search;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute
    ) {
        router.events.pipe(
            filter(e => e instanceof ActivationEnd),
        ).subscribe((d: Data) => {
            // console.log(d.snapshot.queryParams)
            this.search = d.snapshot.queryParams;
            this.searchChannelsVideos(d.snapshot.queryParams);
        });

        // console.log(route.snapshot)
        // this.searchChannelsVideos(route.snapshot.queryParams);
    }

    ngOnInit(): void {
        this.videoService.get({}).subscribe(dt => {
            this.videos = dt;
        });

        // this.router.events.subscribe(d => {
        //     if (d instanceof ActivationEnd) {
        //         console.log(d)
        //     }
        // });
        //
        // console.log(this.route.snapshot)
        // this.subject.getVideosSearch().subscribe(d => {
        //     console.log(d)
        // });

    }

    searchChannelsVideos(d) {
        this.channelsService.searchWithVideos(d).subscribe(dt => {
            this.channelsVideos = dt;
        });
    }


    getUploadDateTime(datetime) {
        return moment(datetime).format('MMM DD, YYYY');
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
}
