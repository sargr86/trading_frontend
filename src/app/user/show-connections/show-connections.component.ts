import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {UsersService} from '@core/services/users.service';

@Component({
    selector: 'app-show-connections',
    templateUrl: './show-connections.component.html',
    styleUrls: ['./show-connections.component.scss']
})
export class ShowConnectionsComponent implements OnInit {
    selectedTabIndex = 1;
    subscriptions: Subscription[] = [];
    authUser;

    connections = [];
    connectionRequests = [];

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private usersService: UsersService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getConnections();
    }

    tabChange(e) {

    }

    getConnections() {
        this.usersService.getUserConnections({user_id: this.authUser.id}).subscribe(dt => {
            this.connections = dt.filter(d => d.confirmed === 1);
            this.connectionRequests = dt.filter(d => d.confirmed === 0);
            console.log(this.connectionRequests)
        });
    }

}
