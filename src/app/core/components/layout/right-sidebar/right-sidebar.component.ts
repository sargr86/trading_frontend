import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {UserStoreService} from '@core/services/stores/user-store.service';

@Component({
    selector: 'app-right-sidebar',
    templateUrl: './right-sidebar.component.html',
    styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
    @Input() shownItems = 'notifications';
    @Output() closeSidenav = new EventEmitter();
    authUser;
    subscriptions = [];
    usersMessages = [];

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private userStore: UserStoreService
    ) {
    }

    ngOnInit(): void {
        this.getAuthenticatedUser();
        this.authUser = this.getAuthUser.transform();
        // console.log(this.authUser)
    }

    getAuthenticatedUser() {
        this.subscriptions.push(this.userStore.authUser$.subscribe(dt => {
            // console.log('AUTH USER', dt)
            this.authUser = dt;
            // this.addUserToSocket([]);
        }));
    }


}
