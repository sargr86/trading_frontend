import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-right-sidebar',
    templateUrl: './right-sidebar.component.html',
    styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
    @Input() shownItems = 'notifications';
    @Output() closeSidenav = new EventEmitter();
    @Output() openBottomChatBox = new EventEmitter();
    authUser;
    subscriptions = [];
    usersMessages = [];

    constructor(
        private getAuthUser: GetAuthUserPipe,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
    }


}
