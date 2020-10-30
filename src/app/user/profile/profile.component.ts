import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS, PROFILE_PAGE_TABS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Router} from '@angular/router';

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
    authUser;

    activeTab = PROFILE_PAGE_TABS[0];
    allTabs = PROFILE_PAGE_TABS;

    apiUrl = API_URL;

    constructor(
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.videoService.getUserVideos({username: this.authUser.username}).subscribe(dt => {
            this.userVideos = dt;
        });
    }

    changeActiveTab(tab) {
        this.activeTab = tab;
    }

    openVideoPage(video) {
        console.log(video.filename);
        this.router.navigate(['user/video/play', {queryParams: video._id}]);
    }


}
