import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {VIDEO_FILTERS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-video-filters',
    templateUrl: './video-filters.component.html',
    styleUrls: ['./video-filters.component.scss']
})
export class VideoFiltersComponent implements OnInit {
    filters = VIDEO_FILTERS;
    selectedFilters = {};

    @Output('filter') filterAction = new EventEmitter();

    constructor(
        private videoService: VideoService
    ) {
    }

    ngOnInit(): void {
    }

    applyFilter({name, value}, group) {
        this.selectedFilters[group] = {name, value};
        this.filterAction.emit(this.selectedFilters);
    }

    removeFilter({name, value}, group) {
        delete this.selectedFilters[group];
        this.filterAction.emit(this.selectedFilters);
    }

}
