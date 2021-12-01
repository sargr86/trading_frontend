import {Component, Input, OnInit} from '@angular/core';
import {UsersService} from "@core/services/users.service";

@Component({
    selector: 'app-connections-tab',
    templateUrl: './connections-tab.component.html',
    styleUrls: ['./connections-tab.component.scss']
})
export class ConnectionsTabComponent implements OnInit {
    @Input() authUser;
    connections = [];

    constructor(
        private usersService: UsersService
    ) {
    }

    ngOnInit(): void {
        this.getConnections();
    }

    getConnections() {
        this.usersService.getUserContacts({user_id: this.authUser.id}).subscribe(dt => {
            this.connections = dt;
        });
    }

}
