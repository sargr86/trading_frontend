import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {ChannelsService} from '@core/services/channels.service';
import {API_URL} from '@core/constants/global';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {AuthService} from '@core/services/auth.service';
import {environment} from '@env';
import {StocksService} from '@core/services/stocks.service';

@Component({
    selector: 'app-left-sidebar',
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
    channels = [];
    apiUrl = API_URL;
    authUser;
    routerUrl;
    envName;
    stocks;
    indices;

    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor(
        public router: Router,
        private channelsService: ChannelsService,
        private getAuthUser: GetAuthUserPipe,
        public auth: AuthService,
        private subject: SubjectService,
        private stocksService: StocksService
    ) {
        this.envName = environment.envName;
        this.authUser = this.getAuthUser.transform();
        if (this.authUser) {
            this.channelsService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(dt => {
                this.channels = dt;
            });
        }
        this.subject.getUserSubscriptions().subscribe(dt => {
            this.channels = dt;
        });
    }

    ngOnInit(): void {
        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
            } else if (ev instanceof ActivationEnd) {

            }
        });

        this.stocksService.getDailyStocks({}).subscribe(dt => {
            this.stocks = dt;
        });

        this.stocksService.getIndices({}).subscribe(dt => {
            this.indices = dt;
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        // this.channels = moveItemInArray(this.channels, event.previousIndex, event.currentIndex);

    }

    dragDropped(e, channel) {
        // console.log(e)
        // console.log(channel)
        this.channels = moveItemInArray(this.channels, e.previousIndex, e.currentIndex);
        // console.log(this.channels)
        const sendData = {
            rows: JSON.stringify(this.channels),
            channel_id: channel.id,
            user_id: this.authUser.id
        };
        this.channelsService.changeSubscriptionPriority(sendData).subscribe(dt => {
        });
    }

    async openChannelPage(channel) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            await this.router.navigate(['channels/show'], {queryParams: {username: channel.user.username}})
        );
    }

    viewAllSubscriptions() {
        this.router.navigate(['channels/subscriptions']);
        this.closeSidenav.emit(true);
    }

    changePage(route, params = {}) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([route], {queryParams: params})
        );
    }

    isSmallScreen() {
        return window.screen.availWidth < 768;
    }

    getPercentageDetails(stock) {
        const value = stock.changesPercentage; //.replace(/[(%)]/g, '')
        return {
            ...{value},
            color: (+value > 0 ? 'green' : 'red'),
            class: 'analytics-text-' + (+value > 0 ? '4' : '5')
        };
    }


}
