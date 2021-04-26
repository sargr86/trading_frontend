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

@Component({
    selector: 'app-stocks-list-sample',
    templateUrl: './stocks-list-sample.component.html',
    styleUrls: ['./stocks-list-sample.component.scss']
})
export class StocksListSampleComponent implements OnInit, OnChanges {
    @Input('stocks') passedStocks = [];
    @Input('userStocks') userStocks = [];
    @Input('follow') follow = true;
    @Input('unfollow') unfollow = false;
    @Input('portable') portable = false;
    @Input('type') selectedStockType;
    @Input('sort') sort = {name: '', id: ''};
    @Input('editPortable') editPortable = false;

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


    // Stock chart settings
    view: any[] = [180, 130];
    portableView: any[] = [100, 130];
    colorScheme = {
        domain: ['#ffffff']
    };


    @Output('updatedStocksList') updatedStocksList = new EventEmitter();

    constructor(
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef,
        private stocksService: StocksService,
        private updateStocks: UpdateUserStocksPipe
    ) {
        this.authUser = this.getAuthUser.transform();
        // this.subject.getUserStocksData().subscribe(dt => {
        //     this.userStocks = dt;
        //     this.cdr.detectChanges();
        // });
    }

    ngOnInit(): void {
        this.selectedSortType = this.sort;

        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
            }
        });
    }


    updateFollowedStocksList(stock) {
        const {userStocks} = this.updateStocks.transform(this.userStocks, stock, this.selectedStockType?.id);
        this.updatedStocksList.emit(userStocks);

    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    openStockProfile(stock) {
        console.log(this.portable)
        if (!this.portable) {
            this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () => {
                    await this.router.navigate([`stocks/${stock}/analytics`]);
                }
            );
        } else {
            this.updateFollowedStocksList(stock);
        }
    }

    getPercentageDetails(stock) {
        const value = +stock.changesPercentage; // .replace(/[(%)]/g, '')
        return {
            ...{value},
            color: (+value > 0 ? 'green' : 'red'),
            class: 'analytics-text-' + (+value > 0 ? '4' : '5')
        };
    }

    getSearchResults(e) {
        console.log(e)
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
            console.log(dt)
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
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
            order_type: type.value
        };
        // console.log(sendData)

        if (type.name !== 'My sort') {
            this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
                localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
            });
        } else {
            this.stocksService.getUserStocks({sort_type: type, user_id: this.authUser.id}).subscribe(dt => {
                this.passedStocks = dt?.user_stocks || [];
                console.log(this.passedStocks)
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
            } else if (property === 'userStocks') {
                this.userStocks = changes.userStocks.currentValue;
            }
        }
    }

}
