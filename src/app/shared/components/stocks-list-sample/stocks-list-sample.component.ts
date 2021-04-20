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
import {Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {StocksService} from '@core/services/stocks.service';

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
    stocksLoading = 'idle';
    authUser;
    userStocksOnly = this.passedStocks === this.userStocks;

    editUserStocks = false;
    sortTypes = [
        {name: 'My sort', value: 'custom'},
        {name: 'A-Z', value: 'alphabetical'},
        {name: 'Gain', value: 'gain'},
        {name: 'Loss', value: 'loss'}
    ];
    selectedSortType;

    @Output('updatedStocksList') updatedStocksList = new EventEmitter();

    constructor(
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef,
        private stocksService: StocksService
    ) {
        this.authUser = this.getAuthUser.transform();
        this.subject.getUserStocksData().subscribe(dt => {
            this.userStocks = dt;
            this.cdr.detectChanges();
        });
    }

    ngOnInit(): void {
        this.selectedSortType = this.sort;
        // console.log(this.selectedSortType)
        // console.log(this.passedStocks, this.portable, this.sort)
    }

    updateFollowedStocksList(stock) {

        const following = this.userStocks.find(f => f.name === stock.name);

        if (!following) {
            this.userStocks.push({
                name: stock.name,
                symbol: stock.symbol,
                change: stock.change,
                changesPercentage: stock.changesPercentage,
                price: stock.price,
                type_id: this.selectedStockType.id
            });
        } else {
            this.userStocks = this.userStocks.filter(f => f.name !== stock.name);
        }

        this.updatedStocksList.emit(this.userStocks);

    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    openStockProfile(stock) {
        // if (!this.follow) {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([`stocks/${stock}/analytics`])
        );
        // }
    }

    getPercentageDetails(stock) {
        // console.log(+stock.changesPercentage.toFixed(2))
        const value = +stock.changesPercentage; // .replace(/[(%)]/g, '')
        return {
            ...{value},
            color: (+value > 0 ? 'green' : 'red'),
            class: 'analytics-text-' + (+value > 0 ? '4' : '5')
        };
    }

    drop(e) {

    }

    dragDropped(e, stock) {
        // console.log(channel)
        this.passedStocks = moveItemInArray(this.passedStocks, e.previousIndex, e.currentIndex);
        const sendData = {
            order_type: 'custom',
            rows: JSON.stringify(this.passedStocks),
            user_id: this.authUser.id
        };
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            this.selectedSortType = this.sortTypes[0];
        });
    }

    onlyFirst10Stocks(stocks) {
        return stocks.filter((st, index) => index < 10);
    }

    sortStocks(type) {
        // console.log(type)
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

        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
        });
        // this.stocksService.getStocksSorted({sort_type: type, user_id: this.authUser.id}).subscribe(dt => {
        //     this.passedStocks = dt?.user_stocks || [];
        //     console.log(this.passedStocks)
        // });
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes)
        for (const property in changes) {
            if (property === 'selectedStockType') {
                this.selectedStockType = changes.selectedStockType.currentValue;
                // console.log('Current:', changes.selectedStockType.currentValue);
            }
        }
    }

}
