import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GetAuthUserPipe} from "@shared/pipes/get-auth-user.pipe";

@Component({
    selector: 'app-show-connections',
    templateUrl: './show-connections.component.html',
    styleUrls: ['./show-connections.component.scss']
})
export class ShowConnectionsComponent implements OnInit {
    selectedTabIndex = 0;
    subscriptions: Subscription[] = [];
    authUser;

    constructor(
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
    }

    tabChange(e) {

    }

}
