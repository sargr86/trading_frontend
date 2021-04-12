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

@Component({
    selector: 'app-stocks-list-sample',
    templateUrl: './stocks-list-sample.component.html',
    styleUrls: ['./stocks-list-sample.component.scss']
})
export class StocksListSampleComponent implements OnInit, OnChanges {
    @Input('stocks') passedStocks = [];
    @Input('userStocks') userStocks = [];
    @Input('follow') follow = true;
    @Input('portable') portable = false;
    @Input('type') selectedStockType;
    editUserStocks = false;
    stocksLoading = 'idle';
    authUser;
    userStocksOnly = this.passedStocks === this.userStocks;

    @Output('updatedStocksList') updatedStocksList = new EventEmitter();

    constructor(
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef
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
        if (!this.follow) {
            this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
                await this.router.navigate([`stocks/${stock}/analytics`])
            );
        }
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
