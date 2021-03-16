import {Component, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit, OnDestroy {
    apiUrl = API_URL;
    search;
    subscriptions: Subscription[] = [];
    showFilters = false;

    constructor(
        private videoService: VideoService,
        private subjectService: SubjectService,
        public router: Router,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
    }

    ngOnInit(): void {
        this.search = localStorage.getItem('search');
    }



    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
