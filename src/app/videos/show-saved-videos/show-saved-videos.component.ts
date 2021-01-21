import {Component, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {ChannelsService} from '@core/services/channels.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {API_URL} from '@core/constants/global';
import * as moment from 'moment';

@Component({
    selector: 'app-show-saved-videos',
    templateUrl: './show-saved-videos.component.html',
    styleUrls: ['./show-saved-videos.component.scss']
})
export class ShowSavedVideosComponent implements OnInit {

    userVideos;
    channelsVideos = [];
    apiUrl = API_URL;
    search;
    authUser;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute,
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {

        this.authUser = this.getAuthUser.transform();

        this.videoService.getUserSavedVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.userVideos = dt;
        });
    }

    getUploadDateTime(datetime) {
        return moment(datetime).format('MMM DD, YYYY');
    }

    openVideoPage(video, username) {
        let route;
        let params;
        if (video.status === 'live') {
            route = 'user/video/watch';
            params = {session: video.session_name, publisher: username, id: video.id};
        } else {
            route = 'videos/play';
            params = {id: video.id};
        }


        this.router.navigate([route], {queryParams: params});
    }

    openChannelPage(channel, username) {
        this.router.navigate(['channels/show'], {queryParams: {username}});
    }

}
