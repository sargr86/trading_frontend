import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';

@Component({
    selector: 'app-videos-tab',
    templateUrl: './videos-tab.component.html',
    styleUrls: ['./videos-tab.component.scss']
})
export class VideosTabComponent implements OnInit {

    owlOptions: OwlOptions = OWL_OPTIONS;
    apiUrl = API_URL;

    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    constructor() {
    }

    ngOnInit(): void {
    }

}
