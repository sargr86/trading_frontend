import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-show-connections',
    templateUrl: './show-connections.component.html',
    styleUrls: ['./show-connections.component.scss']
})
export class ShowConnectionsComponent implements OnInit {

    subscriptions: Subscription[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }

}
