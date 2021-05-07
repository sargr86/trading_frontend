import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {NavigationEnd, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {StocksService} from '@core/services/stocks.service';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {Subscription} from 'rxjs';
import {LoaderService} from '@core/services/loader.service';

@Component({
    selector: 'app-stocks-list-sample',
    templateUrl: './stocks-list-sample.component.html',
    styleUrls: ['./stocks-list-sample.component.scss']
})
export class StocksListSampleComponent implements OnInit, OnChanges {
    @Input('stocks') passedStocks = [];
    @Input('userStocks') userStocks = [];
    @Input('followAllowed') followAllowed = true;
    @Input('unfollow') unfollow = false;
    @Input('portable') portable = false;
    @Input('type') selectedStockType;
    @Input('sort') sort = {name: '', id: ''};
    @Input('editPortable') editPortable = false;
    @Input('modal') modal = false;
    @Input('pagination') pagination = false;

    authUser;
    userStocksOnly = this.passedStocks === this.userStocks;
    routerUrl;

    editUserStocks = false;
    sortTypes = [
        {name: 'My sort', value: 'custom'},
        {name: 'A-Z', value: 'alphabetical'},
        {name: 'Gain', value: 'gain'},
        {name: 'Loss', value: 'loss'}
    ];
    selectedSortType;
    sortedListLoading = false;


    // Stock chart settings
    view: any[] = [180, 130];
    portableView: any[] = [100, 130];
    colorScheme = {
        domain: ['#ffffff']
    };

    subscriptions: Subscription[] = [];


    @Output('updatedStocksList') updatedStocksList = new EventEmitter();

    constructor(
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef,
        private stocksService: StocksService,
        private updateStocks: UpdateUserStocksPipe,
        public loader: LoaderService
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.selectedSortType = this.sort || this.authUser.stocks_order_type;
        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
            }
        });

        // this.subscriptions.push(this.loader.currentLoaderState.subscribe(dt => {
        //     this.sortedListLoading = dt;
        // }));

    }


    updateFollowedStocksList(stock) {
        const {userStocks, following} = this.updateStocks.transform(this.userStocks, stock, this.selectedStockType?.id);

        if (this.pagination) {

        } else if (!this.modal) {
            this.passedStocks = userStocks;
        } else {
            if (following) {
                this.userStocks = userStocks;
            } else {
                this.passedStocks = userStocks;
            }
        }
        // this.loader.show();
        // this.loader.stocksLoading = 'loading';
        this.updatedStocksList.emit(userStocks);

    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    openStockProfile(stock) {
        if (!this.modal) {
            this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () => {
                    await this.router.navigate([`stocks/${stock}/analytics`]);
                }
            );
        }
    }


    getPercentageDetails(stock) {
        const value = +stock.changesPercentage; // .replace(/[(%)]/g, '')
        return {
            ...{value},
            color: (+value > 0 ? 'green' : 'red'),
            class: 'stock-' + (+value > 0 ? 'green' : 'red')
        };
    }


    getSearchResults(e) {
        this.updateFollowedStocksList(e);
    }

    drop(e) {

    }

    dragDropped(e, stock) {
        this.passedStocks = moveItemInArray(this.passedStocks, e.previousIndex, e.currentIndex);
        const sendData = {
            order_type: 'custom',
            rows: JSON.stringify(this.passedStocks),
            user_id: this.authUser.id
        };
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            this.selectedSortType = this.sortTypes[0];
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
            this.subject.changeAuthUser((dt.hasOwnProperty('token') ? dt.token : ''));
        });
    }

    onlyFirst10Stocks(stocks) {
        return stocks.filter((st, index) => index < 10);
    }

    sortStocks(type) {
        this.selectedSortType = type;
        if (type.name !== 'My sort') {

            this.passedStocks.sort((a, b) => {
                if (type.name === 'A-Z') {
                    return a.name.localeCompare(b.symbol);
                } else {
                    return a.change > b.change ? -1 : 1;
                }
            });

            if (type.name === 'Loss') {
                this.passedStocks.reverse();
            }
        }

        const sendData = {
            rows: JSON.stringify(this.passedStocks),
            user_id: this.authUser.id,
            order_type: type.value,
            changeSortTypeOnly: true
        };
        // console.log(sendData)
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
            this.subject.changeAuthUser((dt.hasOwnProperty('token') ? dt.token : ''));
        });

        if (type.name === 'My sort') {
            this.sortedListLoading = true;
            this.stocksService.getUserStocks({sort_type: type.value, user_id: this.authUser.id}).subscribe(dt => {
                this.passedStocks = dt?.user_stocks || [];
                this.sortedListLoading = false;
            });
        }

    }

    getPortableColorScheme(stock) {
        return {
            domain: (stock.changesPercentage > 0 ? ['#18B587'] : ['#F53C6F'])
        };
    }


    ngOnChanges(changes: SimpleChanges) {

        for (const property in changes) {
            if (property === 'selectedStockType') {
                this.selectedStockType = changes.selectedStockType.currentValue;
            }
            // else if (property === 'userStocks') {
            //     this.userStocks = changes.userStocks.currentValue;
            //     if (this.selectedSortType?.name) {
            //         this.sortStocks(this.selectedSortType);
            //     }
            // }
            // else if (property === 'passedStocks') {
            //     this.passedStocks = changes.passedStocks.currentValue;
            //     if (this.selectedSortType?.name) {
            //         this.sortStocks(this.selectedSortType);
            //     }
            // }
        }
    }

}
