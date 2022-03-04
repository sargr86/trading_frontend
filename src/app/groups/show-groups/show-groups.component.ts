import {Component, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {CreateNewGroupDialogComponent} from '@core/components/modals/create-new-group-dialog/create-new-group-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-show-groups',
    templateUrl: './show-groups.component.html',
    styleUrls: ['./show-groups.component.scss']
})
export class ShowGroupsComponent implements OnInit {
    authUser;
    groups = [];

    subscriptions: Subscription[] = [];

    constructor(
        public groupsMessagesStore: GroupsMessagesSubjectService,
        private chatService: ChatService,
        private userStore: UserStoreService,
        private socketService: SocketIoService,
        public router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getAuthUser();
        this.trackGroups();
    }

    trackGroups() {
        this.subscriptions.push(this.groupsMessagesStore.groupsMessages$.subscribe(dt => {
            this.groups = dt;
        }));
    }

    getAuthUser() {
        this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        });
    }

    filterGroups(type) {
        return this.groups.filter(g => {
            return type === 'managed' ?
                g.creator_id === this.authUser.id :
                g.creator_id !== this.authUser.id;
        });
    }

    openModal() {
        this.dialog.open(CreateNewGroupDialogComponent, {
            width: '500px',
            height: '450px',
            data: this.authUser
        }).afterClosed().subscribe(async (selectedGroup) => {
            if (selectedGroup) {
                await this.router.navigateByUrl('/groups/' + selectedGroup.name + '/people');
            }
        });
    }

}
