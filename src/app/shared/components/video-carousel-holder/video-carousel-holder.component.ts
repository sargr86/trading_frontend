import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {OWL_OPTIONS} from '@core/constants/global';

@Component({
    selector: 'app-video-carousel-holder',
    templateUrl: './video-carousel-holder.component.html',
    styleUrls: ['./video-carousel-holder.component.scss']
})
export class VideoCarouselHolderComponent implements OnInit {
    owlOptions: OwlOptions = OWL_OPTIONS;

    @Input('videos') videos = [];
    @Input('title') title = '';
    @Input('videoList') videoList = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    openVideoPage(video, username) {
    }

}
