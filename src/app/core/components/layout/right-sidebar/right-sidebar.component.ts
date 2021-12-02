import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-right-sidebar',
    templateUrl: './right-sidebar.component.html',
    styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }


}
