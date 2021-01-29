import {Component, OnInit} from '@angular/core';
import {VIDEO_FILTERS} from '@core/constants/global';

@Component({
    selector: 'app-video-filters',
    templateUrl: './video-filters.component.html',
    styleUrls: ['./video-filters.component.scss']
})
export class VideoFiltersComponent implements OnInit {
    filters = VIDEO_FILTERS;

    constructor() {
    }

    ngOnInit(): void {
    }

}
