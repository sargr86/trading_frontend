import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS, PROFILE_PAGE_TABS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {CroppedEvent} from 'ngx-photo-editor';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {User} from '@shared/models/user';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    owlOptions: OwlOptions = OWL_OPTIONS;
    owlTextsArray = [
        {name: 'David Blaine Ascension'},
        {name: 'All Videos'},
        {name: 'Lorem ipsum'},
        {name: 'Lorem ipsum'}
    ];
    currentUser: User;
    watchlistVideos = [];
    authUser;

    activeTab = PROFILE_PAGE_TABS[0];
    allTabs = PROFILE_PAGE_TABS;

    apiUrl = API_URL;

    profileChangedEvent: any;
    coverChangedEvent: any;
    profileBase64: any;
    coverBase64: any;

    channelUser;
    passedUsername;

    constructor(
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private usersService: UsersService,
        private base64ToFile: Base64ToFilePipe,
        private route: ActivatedRoute
    ) {
        this.authUser = this.getAuthUser.transform();
        this.passedUsername = this.route.snapshot.queryParams.username;
    }

    ngOnInit(): void {
        if (this.passedUsername) {
            this.usersService.getUserInfo({username: this.passedUsername}).subscribe(dt => {
                this.channelUser = dt;
                console.log(this.channelUser.username, this.authUser.username)
            });
        }

        this.videoService.getUserVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.currentUser = dt;
        });

        this.videoService.getVideosByAuthor({}).subscribe(dt => {
            this.watchlistVideos = dt;
        });
    }

    changeActiveTab(tab) {
        this.activeTab = tab;
    }

    openVideoPage(video, username) {
        console.log(username);
        let route;
        let params;
        if (video.status === 'live') {
            route = 'user/video/watch';
            params = {session: video.session_name, publisher: username};
        } else {
            route = 'user/video/play';
            params = {id: video.id};
        }


        this.router.navigate([route], {queryParams: params});
    }

    coverChangeEvent(event: any) {
        this.coverChangedEvent = event;
    }

    profileChangeEvent(event: any) {
        this.profileChangedEvent = event;
    }

    profileCropped(event: CroppedEvent) {
        this.profileBase64 = event.base64;
        const filename = `profile_${Date.now()}.jpg`;
        const fd = new FormData();
        fd.append('avatar_file', this.base64ToFile.transform(event.base64), filename);
        fd.append('avatar', filename);
        fd.append('id', this.authUser.id);
        this.usersService.changeProfileImage(fd).subscribe((dt) => {
            localStorage.setItem('token', dt.token);
            this.authUser = this.getAuthUser.transform();
            this.channelUser = this.authUser;
        });
    }

    coverCropped(event: CroppedEvent) {
        this.coverBase64 = event.base64;
        const fd = new FormData();
        const filename = `cover_${Date.now()}.jpg`;
        fd.append('cover_file', this.base64ToFile.transform(event.base64), filename);
        fd.append('cover', filename);
        fd.append('id', this.authUser.id);
        this.usersService.changeCoverImage(fd).subscribe((dt) => {
            localStorage.setItem('token', dt.token);
            this.authUser = this.getAuthUser.transform();
            this.channelUser = this.authUser;
        });
    }

}
