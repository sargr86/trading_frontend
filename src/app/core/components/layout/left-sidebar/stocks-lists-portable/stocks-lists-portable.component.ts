import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AuthService} from '@core/services/auth.service';
import {SubjectService} from '@core/services/subject.service';
import {StocksService} from '@core/services/stocks.service';
import {NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import IsResponsive from '@core/helpers/is-responsive';
import {Subscription} from 'rxjs';
import {LoaderService} from '@core/services/loader.service';
import {Tab} from '@shared/models/tab';
import {MINI_GRAPHS_TABS} from '@core/constants/global';

@Component({
    selector: 'app-stocks-lists-portable',
    templateUrl: './stocks-lists-portable.component.html',
    styleUrls: ['./stocks-lists-portable.component.scss']
})
export class StocksListsPortableComponent implements OnInit, OnDestroy {

    @Input('authUser') authUser;
    routerUrl;
    userStocks;

    selectedSortType;
    stocksSortTypes = [];

    stocks;
    indices;

    isSmallScreen = IsResponsive.isSmallScreen();
    dataLoading = 'idle';

    subscriptions: Subscription[] = [];
    authDataLoaded = false;

    tabsList: Tab[] = MINI_GRAPHS_TABS;
    activeTab: Tab = MINI_GRAPHS_TABS[0];

    disallowedStocks = false;

    constructor(
        public router: Router,
        private getAuthUser: GetAuthUserPipe,
        public auth: AuthService,
        private subject: SubjectService,
        private stocksService: StocksService,
        private cdr: ChangeDetectorRef,
        public loader: LoaderService
    ) {
    }

    ngOnInit(): void {


        this.authUser = this.getAuthUser.transform();
        this.selectedSortType = this.authUser.stocks_order_type;
        this.subscriptions.push(this.router.events.subscribe(ev => {
            if (ev instanceof RoutesRecognized) {
                if (ev.url !== '/test') {
                    this.routerUrl = ev.url;
                    // if (!this.routerUrl?.includes('analytics')) {
                    // this.getIndices();  //@todo responsible for indices refresh on every page change
                    // }
                    this.disallowedStocks = this.routerUrl?.includes('publish') || this.routerUrl?.includes('videos/test');
                    console.log(this.disallowedStocks)
                    if (this.authUser && !this.disallowedStocks) {
                        this.subscriptions.push(this.subject.currentUserStocks.subscribe((dt: any) => {
                            this.userStocks = dt.stocks;
                            // this.getStockTypes();

                            this.cdr.detectChanges();
                            this.loader.hide();
                        }));

                        this.subscriptions.push(this.subject.currentStockSortTypes.subscribe(dt => {
                            this.stocksSortTypes = dt;
                            this.selectedSortType = dt[0];
                        }));

                        this.getUserStocks();
                        this.getIndices(); // @todo remove if refreshing implemented
                    }
                }

            }
        }));


        this.subscriptions.push(this.subject.getStocksData().subscribe(dt => {
            this.stocks = dt;
            this.cdr.detectChanges();
        }));


    }

    getActiveTab(e) {
        this.activeTab = e;
    }


    getIndices() {
        this.subscriptions.push(this.stocksService.getIndices({}).subscribe(dt => {
            this.indices = dt;
            this.subject.changeIndices(dt);
        }));
    }


    getUserStocks() {
        this.loader.stocksLoading.status = 'loading';
        this.subscriptions.push(this.stocksService.getUserStocks({
            user_id: this.authUser.id,
            sort_type: this.authUser.stocks_order_type?.value.toLowerCase()
        }).subscribe(dt => {
            this.selectedSortType = dt?.stocks_order_type;
            this.userStocks = dt?.user_stocks || [];
            this.loader.stocksLoading.status = 'finished';
            this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
        }));


    }

    updateFollowedLists(stocks) {
        this.subscriptions.push(this.stocksService.updateFollowedStocks({user_id: this.authUser.id, ...{stocks}}).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.loader.stocksLoading.status = 'finished';
            this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
        }));
    }

    async viewFullWatchlist() {
        await this.router.navigate(['channels/show'], {
            queryParams: {
                username: this.authUser.username,
                tab: 'watchlist'
            }
        });
    }

    updateUserStocksPriority(e) {

        const sendData = {
            order_type: e.orderType.toLowerCase(),
            rows: JSON.stringify(e.stocks),
            user_id: this.authUser.id,
            changeSortTypeOnly: e.orderType !== 'custom'
        };
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            this.selectedSortType = this.stocksSortTypes[0];
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
            this.subject.changeAuthUser((dt.hasOwnProperty('token') ? dt.token : ''));
            this.subject.changeUserStocks({stocks: e.stocks});
        });
    }

    sortStocks(type) {
        this.selectedSortType = type;
        if (type.name !== 'My sort') {

            this.userStocks.sort((a, b) => {
                if (type.name === 'A-Z') {
                    return a.name.localeCompare(b.symbol);
                } else {
                    return a.change > b.change ? -1 : 1;
                }
            });

            if (type.name === 'Loss') {
                this.userStocks.reverse();
            }
        }
        //
        // const sendData = {
        //     rows: JSON.stringify(this.userStocks),
        //     user_id: this.authUser.id,
        //     order_type: type.value,
        //     changeSortTypeOnly: true
        // };
        // this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
        //     // localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
        //     // this.subject.changeAuthUser((dt.hasOwnProperty('token') ? dt.token : ''));
        // });
        //
        // if (type.name === 'My sort') {
        //     // this.sortedListLoading = true;
        //     this.stocksService.getUserStocks({sort_type: type.value, user_id: this.authUser.id}).subscribe(dt => {
        //         this.userStocks = dt?.user_stocks || [];
        //         // this.sortedListLoading = false;
        //     });
        // }

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
