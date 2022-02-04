import {Component, Input, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {Router} from '@angular/router';
import {VideoService} from '@core/services/video.service';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';

@Component({
    selector: 'app-videos-tab',
    templateUrl: './videos-tab.component.html',
    styleUrls: ['./videos-tab.component.scss']
})
export class VideosTabComponent implements OnInit {

    apiUrl = API_URL;
    showFilters = false;
    search = '';
    filters = null;
    userVideos = [];
    videosLoaded = false;

    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    constructor(
        public router: Router,
        private videoService: VideoService,
        private subjectService: SubjectService,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
    }

    ngOnInit(): void {

        this.subjectService.getToggleFiltersData().subscribe(dt => {
            this.showFilters = dt;
        });
    }

    getUserVideos(params) {

        params = this.getExactParams.transform(params);
        params.user_id = this.channelUser.id;
        this.videoService.getUserVideos(params).subscribe(dt => {
            this.videosLoaded = true;
            this.channelUser.videos = dt?.videos;
        });
    }

    getSearchResults(s) {
        this.search = s;
        this.getUserVideos({search: this.search, filters: this.filters});
    }

    getFilteredVideos(e) {
        this.filters = e;
        this.getUserVideos({search: this.search, filters: this.filters});
    }

}
