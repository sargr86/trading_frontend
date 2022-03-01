import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {PROFILE_PAGE_TABS} from '@core/constants/global';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '@core/services/users.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-show-profile',
    templateUrl: './show-profile.component.html',
    styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent implements OnInit, OnDestroy {
    authUser;
    profileUser;
    profileTabs = PROFILE_PAGE_TABS;
    subscriptions: Subscription[] = [];

    connectionsCount = 0;
    connections = [];
    connectionRequests = [];
    passedUsername: string;

    ownProfile = false;


    usersConnection;
    usersConnectionStatus = 'idle';
    attemptedToConnect = false;
    isBlocked = false;

    constructor(
        private userStore: UserStoreService,
        private usersConnectionsStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private usersService: UsersService,
        private socketService: SocketIoService,
        private route: ActivatedRoute,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.passedUsername = this.route.snapshot.params.username;
        this.trackAuthUserChanges();
        this.trackUserConnections();
        this.getUserInfo();

        if (this.profileUser) {
            this.checkIfUsersConnected();
            this.getAcceptedDeclinedRequests();
            this.getConnectWithUser();
            this.getDisconnectUsers();
            this.cancelledUsersConnecting();
            this.getBlockUnblockUser();
            this.getConnectionsChanges();
        }
    }

    trackAuthUserChanges() {
        this.subscriptions.push(this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        }));
    }

    getUserInfo() {
        this.ownProfile = this.authUser.username === this.passedUsername;
        if (this.passedUsername) {
            this.subscriptions.push(this.usersService.getUserInfo({
                username: this.passedUsername,
                own_channel: this.ownProfile
            }).subscribe(dt => {
                if (dt) {
                    this.profileUser = dt;
                }
            }));
        }
    }

    trackUserConnections() {
        this.subscriptions.push(this.usersConnectionsStore.usersMessages$.subscribe(dt => {
            this.connectionsCount = dt.length;
            this.connections = dt.filter(d => d.users_connections[0].confirmed === 1);
            this.connectionRequests = dt.filter(d => d.users_connections[0].confirmed === 0);
        }));
    }

    getConnectionsChanges() {
        this.subscriptions.push(this.usersConnectionsStore.usersMessages$.subscribe((dt: any) => {
            console.log('connection changed!!!', dt, this.profileUser.id);
            this.usersConnection = dt.find(d => d.id === this.profileUser.id)?.users_connections[0];
            console.log(this.usersConnection);
            //
            //     if (dt.filter(d => d.id === this.channelUser.id)) {
            //         this.usersConnectionStatus = 'connected';
            //         this.isBlocked = false;
            //     }
        }));
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            const {notification} = dt;
            console.log(notification);
            if ((notification.to_user.id === this.authUser.id && notification.from_user.id === this.profileUser.id)
                || (notification.to_user.id === this.profileUser.id && notification.from_user.id === this.authUser.id)) {
                this.usersConnectionStatus = 'connected';
                this.isBlocked = false;
            }
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe(() => {
            console.log('declined');
            this.usersConnectionStatus = 'idle';
        }));
    }

    checkIfUsersConnected() {
        this.usersService.checkIfUsersConnected({
            user_id: this.authUser.id,
            channel_user_id: this.profileUser.id
        }).subscribe(dt => {
            this.usersConnection = dt;
            if (dt) {
                this.usersConnectionStatus = dt.confirmed ? 'connected' : 'pending';
                this.isBlocked = !!dt.is_blocked;
            }
        });
    }

    connectWithUser() {
        this.attemptedToConnect = true;
        this.usersConnectionStatus = 'pending';
        this.socketService.connectWithUser({
            from_user: this.authUser,
            to_user: this.profileUser,
            msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                has sent a connection request to you`
        });
    }

    getConnectWithUser() {
        this.socketService.getConnectWithUser().subscribe((dt: any) => {
            this.usersConnection = dt.connection;
        });
    }

    cancelUsersConnecting(connection) {
        console.log(connection)
        this.socketService.cancelUsersConnecting({
            authUser: this.authUser,
            channelUser: this.profileUser,
            connection_id: connection.id
        });
    }

    cancelledUsersConnecting() {
        this.socketService.cancelledUsersConnecting().subscribe(dt => {
            console.log(dt, 'cancelled');
            this.usersConnectionStatus = 'idle';
        });
    }

    disconnectUser() {
        console.log(this.usersConnection)
        this.socketService.disconnectUsers({
            to_user: this.profileUser,
            from_user: this.authUser,
            connection_id: this.usersConnection.id,
            msg: `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> has broken the connection between you two`,
        });
        this.usersConnectionStatus = 'idle';
    }

    getDisconnectUsers() {
        this.subscriptions.push(this.socketService.getDisconnectUsers().subscribe(dt => {
            this.usersConnectionStatus = 'idle';
        }));
    }

    getBlockUnblockUser() {
        this.subscriptions.push(this.socketService.getBlockUnblockUser().subscribe((dt: any) => {
            console.log('get block/unblock', dt)
            this.isBlocked = true;
        }));
    }

    isMessageBtnShown() {
        return /connected|test/.test(this.usersConnectionStatus) && !this.isBlocked;
    }

    toggleBottomChatBox() {
        const foundUserMessages = this.usersConnectionsStore.usersMessages.find(um => um.id === this.profileUser.id);
        if (foundUserMessages) {
            this.usersConnectionsStore.showBottomChatBox = true;
            this.groupsMessagesStore.showBottomChatBox = false;
            this.usersConnectionsStore.changeUser(foundUserMessages);
        }
    }


    onOutletLoaded(component) {
        if (this.connections) {
            component.connections = this.connections;
            component.connectionRequests = this.connectionRequests;
            component.authUser = this.authUser;
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
