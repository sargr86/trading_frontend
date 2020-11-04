import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS, PROFILE_PAGE_TABS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Router} from '@angular/router';
import {CroppedEvent} from 'ngx-photo-editor';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';

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
    userVideos = [];
    watchlistVideos = [];
    authUser;

    activeTab = PROFILE_PAGE_TABS[0];
    allTabs = PROFILE_PAGE_TABS;

    apiUrl = API_URL;

    profileChangedEvent: any;
    coverChangedEvent: any;
    profileBase64: any;
    coverBase64: any;

    constructor(
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private usersService: UsersService,
        private base64ToFile: Base64ToFilePipe
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.videoService.getUserVideos({username: this.authUser.username}).subscribe(dt => {
            this.userVideos = dt;
        });

        this.videoService.getVideosByAuthor({}).subscribe(dt => {
            this.watchlistVideos = dt;
        });
    }

    changeActiveTab(tab) {
        this.activeTab = tab;
    }

    openVideoPage(video) {
        console.log(video.filename);
        this.router.navigate(['user/video/play', {queryParams: video._id}]);
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
        });
    }

}
