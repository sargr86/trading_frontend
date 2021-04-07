import {Component, Input, OnInit} from '@angular/core';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';
import {Router} from '@angular/router';

@Component({
    selector: 'app-show-regular-list',
    templateUrl: './show-regular-list.component.html',
    styleUrls: ['./show-regular-list.component.scss']
})
export class ShowRegularListComponent implements OnInit {

    @Input('items') items;
    @Input('authUser') authUser;

    constructor(
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

    async openVideoPage(video, username) {
        const r = buildPlayVideoRoute(video, username);
        await this.router.navigate([r.route], {queryParams: r.params});
    }

    async openChannelPage(channel, username) {
        await this.router.navigate(['channels/show'], {queryParams: {username}});
    }

    checkIfSavedByCurrentUser(video) {
        return video.users_vids.find(v => v.username === this.authUser?.username && v.users_videos.saved);
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

}
