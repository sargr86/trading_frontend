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
    @Input('sort') sort = false;
    @Input('editPortable') editPortable = false;
    editUserStocks = false;
    stocksLoading = 'idle';
    authUser;
    userStocksOnly = this.passedStocks === this.userStocks;
    selectedSortType = 'My sort';

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
        console.log(e)
        // console.log(channel)
        this.passedStocks = moveItemInArray(this.passedStocks, e.previousIndex, e.currentIndex);
        console.log(this.passedStocks)
        const sendData = {
            rows: JSON.stringify(this.passedStocks),
            // stock_id: stock.id,
            user_id: this.authUser.id
        };
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
        });
    }

    onlyFirst10Stocks(stocks) {
        return stocks.filter((st, index) => index < 10);
    }

    sortStocks(type) {

        switch (type) {
            case 'A-Z':
                this.selectedSortType = 'A-Z';
                this.passedStocks.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Gain':
                this.selectedSortType = 'Gain';
                this.passedStocks.sort((a, b) => {
                    if (a.change > b.change) {
                        return -1;
                    }
                    if (a.change < b.change) {
                        return 1;
                    }
                    return 0;
                });
                break;
            case 'Loss':
                this.selectedSortType = 'Loss';
                this.passedStocks.sort((a, b) => {
                    if (a.change < b.change) {
                        return -1;
                    }
                    if (a.change > b.change) {
                        return 1;
                    }
                    return 0;
                });

                break;
        }


        const sendData = {
            rows: JSON.stringify(this.passedStocks),
            user_id: this.authUser.id
        };

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
