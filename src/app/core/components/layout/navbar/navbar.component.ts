import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {NAVBAR_ADDITIONAL_LINKS} from '@core/constants/global';
import {environment} from '@env';
import {StocksService} from '@core/services/stocks.service';
import {MatDialog} from '@angular/material/dialog';
import {StocksListsModalComponent} from '@shared/components/stocks-lists-modal/stocks-lists-modal.component';
import IsResponsive from '@core/helpers/is-responsive';
import trackByElement from '@core/helpers/track-by-element';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Card} from '@shared/models/card';
import {CardsService} from '@core/services/cards.service';
import {CustomersService} from '@core/services/wallet/customers.service';
import {MatTableDataSource} from '@angular/material/table';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {CountPurchasedTransferredTotalsPipe} from '@shared/pipes/count-purchased-transfered-totals.pipe';
import {cardsStore} from '@shared/stores/cards-store';
import {SocketIoService} from '@core/services/socket-io.service';
import {NotificationsService} from '@core/services/notifications.service';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';
import {ChatService} from '@core/services/chat.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {SetNotificationsPipe} from '@shared/pipes/set-notifications.pipe';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    authUser;
    routerUrl;
    isSmallScreen = IsResponsive.isSmallScreen();
    trackByElement = trackByElement;

    envName = environment.envName;

    @Output('search') search = new EventEmitter();
    @Output('closeSidenav') closeSidenav = new EventEmitter();
    @Output('closeNotifications') closeRightSidenav = new EventEmitter();
    additionalLinks = NAVBAR_ADDITIONAL_LINKS;
    notifications = [];

    passedUsername;

    stocks;
    subscriptions: Subscription[] = [];

    showPurchaseBits = false;

    userCards = [];
    totals;

    cardsStore = cardsStore;

    constructor(
        public router: Router,
        public auth: AuthService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private stocksService: StocksService,
        private paymentsService: PaymentsService,
        private socketService: SocketIoService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private cardsService: CardsService,
        private stripeCustomersService: CustomersService,
        private countTotals: CountPurchasedTransferredTotalsPipe,
        private notificationsService: NotificationsService,
        private userMessagesStore: UserMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private notificationsStore: NotificationsSubjectStoreService,
        private chatService: ChatService,
        private setNotifications: SetNotificationsPipe
    ) {

    }

    ngOnInit(): void {
        this.getAuthenticatedUser();
        this.getRouterUrlParams();

        this.authUser = this.getAuthUser.transform();

        if (this.auth.loggedIn()) {
            this.getInviteNotifications();
            this.addUserToSocket();
            this.getAuthUserNotifications();
            this.getAcceptedDeclinedRequests();
            this.getUserCards();
            this.getDailyStocks();
            this.getConnectWithUser();
            this.getMessagesFromSocket();
            this.getBlockUnblockUser();
            this.getGroupJoinInvitation();
            this.getDisconnected();
        }

        if (this.authUser) {
            // console.log(this.authUser)
            this.getUsersMessages();
            this.getGroupsMessages();
        }


    }

    getUsersMessages() {

        this.subscriptions.push(this.chatService.getDirectMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.userMessagesStore.setUserMessages(dt);
        }));
    }

    getGroupsMessages() {
        this.subscriptions.push(this.chatService.getGroupsMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.groupsMessagesStore.setGroupsMessages(dt);
        }));
    }


    addUserToSocket() {
        this.socketService.addNewUser({...this.authUser, group: true});
    }

    getConnectWithUser() {
        this.subscriptions.push(this.socketService.getConnectWithUser().subscribe((dt: any) => {
            // console.log('get connect with user', dt)
            // if (dt) {
            this.notifications.push(dt);
            this.notificationsStore.setAllNotifications(this.notifications);
            // }
        }));
    }

    getAuthUserNotifications() {
        this.subscriptions.push(
            this.notificationsService.getAuthUserNotifications({user_id: this.authUser.id}).subscribe((dt: any) => {
                dt.map(d => {
                    this.notifications.push(d);
                });
                this.notificationsStore.setAllNotifications(this.notifications);
            })
        );
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            // console.log('accepted', dt)
            this.userMessagesStore.setUserMessages(dt.users_messages);
            if (dt.receiver_id === this.authUser.id) {
                this.notifications.push(dt);
                this.notificationsStore.setAllNotifications(this.notifications);
            }
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            console.log('declined')

            this.notifications.push(dt);
            this.notificationsStore.setAllNotifications(this.notifications);
        }));
    }

    getDisconnected() {
        this.subscriptions.push(this.socketService.getDisconnectUsers({}).subscribe((dt: any) => {
            console.log('disconnected', dt);
            this.setNotifications.transform(dt);
            this.userMessagesStore.setUserMessages(dt.users_messages);
        }));
    }

    getBlockUnblockUser() {
        this.subscriptions.push(this.socketService.getBlockUnblockUser().subscribe((dt: any) => {
            console.log('get block/unblock', dt)
            if (dt.initiator_id !== this.authUser.id) {
                this.setNotifications.transform(dt);
            }
            this.userMessagesStore.setUserMessages(dt.users_messages);
        }));
    }

    getGroupJoinInvitation() {
        this.subscriptions.push(this.socketService.inviteToGroupSent().subscribe((data: any) => {
            if (this.authUser.id === data.to_id) {
                this.setNotifications.transform(data);
            }
            // this.chatService.getChatGroups({user_id: this.authUser.id}).subscribe(dt => {
            //
            //     this.groupsMessages = dt;
            //     this.selectedGroup = this.groupsMessages.find(group => data.group_id === group.id);
            //     this.haveGroupJoinInvitation = true;
            //     console.log(this.selectedGroup)
            // });
        }));
    }

    getAuthenticatedUser() {
        // this.subscriptions.push(this.subject.authUser.subscribe(dt => {
        //     this.authUser = dt;
        // }));
    }

    getRouterUrlParams() {
        this.subscriptions.push(this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
                this.getConnectWithUser();
            } else if (ev instanceof ActivationEnd) {
                this.passedUsername = ev.snapshot.queryParams.username;
            }
        }));
    }

    getUserCards() {

        // Get user cards from saved storage in case of changes in the below components
        this.subscriptions.push(this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
            this.showPurchaseBits = false;
            // console.log(this.userCards)
        }));

        // Getting user cards from the server
        this.subscriptions.push(
            this.stripeCustomersService.getUserCards({user_id: this.authUser.id})
                .subscribe((dt: Card[]) => {
                    this.userCards = dt;
                    this.cardsStore.setCards(dt);
                    // console.log(this.userCards)
                    // this.subject.changeUserCards(dt);
                    this.getAllPaymentsHistory();
                }));
    }

    getAllPaymentsHistory() {
        const params = {customer: this.userCards?.[0]?.stripe_customer_id, user_id: this.authUser.id};
        if (params.customer) {
            this.subscriptions.push(this.paymentsService.getAllPaymentsHistory(params).subscribe(dt => {
                // this.payments = dt;
                this.totals = dt.user_coins;
                // this.subject.setAllPaymentsData(dt);
                this.subject.changePaymentsData(dt);
            }));
        }
    }


    logout() {
        this.subscriptions.push(this.auth.logout().subscribe(async () => {
            localStorage.removeItem('token');
            await this.router.navigate(['/']);
            this.socketService.disconnect({username: this.authUser.username, leavingGroup: true});
        }));
    }

    searchVideos(e) {
        this.search.emit({...e, searchType: 'videos'});
    }

    searchStocks(e) {
        this.search.emit({...e, searchType: 'stocks'});
    }

    toggleMyProfileLink() {
        return !this.router.url.includes('user/profile');
    }

    toggleMyChannelLink() {
        return !this.router.url.includes('channels/show') || this.passedUsername !== this.authUser.username;
    }

    async changePage(l) {
        await this.router.navigate([l.link]);
    }

    getDailyStocks() {
        this.subscriptions.push(this.stocksService.getDailyStocks({}).subscribe(dt => {
            this.stocks = dt;
            this.subject.setStocksData(dt);
        }));
    }

    getPercentageValue(stock) {
        return stock.changesPercentage.replace(/[(%)]/g, '');
    }

    goToChannelPage() {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            this.router.navigate(['channels/show'], {queryParams: {username: this.authUser.username}})
        );
    }

    checkIfUserHasCard() {
        if (this.cardsStore.cards?.length > 0) {
            this.showPurchaseBits = true;
        } else {
            this.toastr.error('Please add at least one card first', 'No cards');
        }
    }

    getInviteNotifications() {
        this.socketService.inviteToGroupSent().subscribe((data: any) => {
            // this.toastr.success(msg);
            console.log(data)
            this.notifications.push({type: 'invitation-to-join-group', msg: data.msg});
            this.notificationsStore.setAllNotifications(this.notifications);
        });
    }

    notificationClicked() {
        this.closeRightSidenav.emit('notifications');
    }

    messagesClicked() {
        this.closeRightSidenav.emit('messages');
    }

    getUnreadNotificationsCount() {
        return this.notificationsStore.allNotifications.filter(n => n?.read === 0).length;
    }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            console.log('new message', dt)
            const {from_id, to_id, direct_messages} = dt;
            if (from_id === this.authUser.id) {
                this.userMessagesStore.changeUserMessages(to_id, direct_messages);
            } else if (to_id === this.authUser.id) {
                this.userMessagesStore.changeUserMessages(from_id, direct_messages);
            }
            console.log(this.userMessagesStore.userMessages)
        }));
    }


    getUnreadMessagesCount() {
        return this.userMessagesStore.userMessages
            .filter(m => m.direct_messages.filter(d => !d.seen && d.from_id !== this.authUser.id).length > 0).length;

    }

    isMessagesIconHidden() {
        return this.routerUrl === '/chat/messages' || !this.auth.loggedIn();
    }

    isWalletIconHidden() {
        return this.routerUrl === '/wallet/show' || !this.auth.loggedIn();
    }

    async openWalletPage() {
        await this.router.navigate(['wallet/show']);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
