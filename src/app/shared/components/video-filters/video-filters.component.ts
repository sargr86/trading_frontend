import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {VIDEO_FILTERS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';

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
        private videoService: VideoService,
        private ifObjectEmpty: CheckForEmptyObjectPipe
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
        if (this.ifObjectEmpty.transform(this.selectedFilters)) {
            this.selectedFilters = null;
        }

        this.filterAction.emit(this.selectedFilters);
    }

}
