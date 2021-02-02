import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {VideoService} from '@core/services/video.service';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-videos-tab',
    templateUrl: './videos-tab.component.html',
    styleUrls: ['./videos-tab.component.scss']
})
export class VideosTabComponent implements OnInit {

    owlOptions: OwlOptions = OWL_OPTIONS;
    apiUrl = API_URL;
    showFilters = false;

    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    constructor(
        public router: Router,
        private videoService: VideoService,
        private subjectService: SubjectService
    ) {
    }

    ngOnInit(): void {

        this.subjectService.getToggleFiltersData().subscribe(dt => {
            this.showFilters = dt;
        });
    }

    getSearchResults(dt) {
        this.channelUser.videos = dt;
    }

    getFilteredVideos(e) {
        this.videoService.searchInUserVideos({
            user_id: this.channelUser.id,
            filters: JSON.stringify(e)
        }).subscribe(dt => {
            this.channelUser.videos = dt?.videos;
        });
    }

}
