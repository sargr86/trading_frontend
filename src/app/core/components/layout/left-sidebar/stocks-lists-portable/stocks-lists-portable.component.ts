import {Component, Input, OnInit} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AuthService} from '@core/services/auth.service';
import {SubjectService} from '@core/services/subject.service';
import {StocksService} from '@core/services/stocks.service';
import {Router} from '@angular/router';
import IsResponsive from '@core/helpers/is-responsive';

@Component({
    selector: 'app-stocks-lists-portable',
    templateUrl: './stocks-lists-portable.component.html',
    styleUrls: ['./stocks-lists-portable.component.scss']
})
export class StocksListsPortableComponent implements OnInit {

    @Input('authUser') authUser;
    @Input('routerUrl') routerUrl;
    userStocks;
    activeTab = {name: 'watchlist'};
    editUserStocks = false;

    stocks;
    indices;

    isSmallScreen = IsResponsive.isSmallScreen();

    constructor(
        public router: Router,
        private getAuthUser: GetAuthUserPipe,
        public auth: AuthService,
        private subject: SubjectService,
        private stocksService: StocksService
    ) {
    }

    ngOnInit(): void {

        this.authUser = this.getAuthUser.transform();
        if (this.authUser) {
            this.subject.getUserStocksData().subscribe(dt => {
                this.userStocks = dt;
            });

            this.getUserStocks();
        }

        this.subject.getStocksData().subscribe(dt => {
            this.stocks = dt;
        });


        this.stocksService.getIndices({}).subscribe(dt => {
            this.indices = dt;
        });
    }


    getPercentageDetails(stock) {
        const value = stock.changesPercentage; //.replace(/[(%)]/g, '')
        return {
            ...{value},
            color: (+value > 0 ? 'green' : 'red'),
            class: 'analytics-text-' + (+value > 0 ? '4' : '5')
        };
    }

    openStockProfile(stock) {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([`stocks/${stock}/analytics`])
        );
    }

    async viewFullWatchlist() {
        await this.router.navigate(['channels/show'], {
            queryParams: {
                username: this.authUser.username,
                tab: 'watchlist'
            }
        });
    }

    changeTab(tab) {
        this.activeTab.name = tab;
    }

    getUserStocks() {
        this.stocksService.getUserStocks({user_id: this.authUser.id}).subscribe(dt => {
            this.userStocks = dt.user_stocks;
        });
    }

    removeStockFromWatchlist(stock) {

        const following = this.userStocks.find(f => f.name === stock.name);

        if (!following) {
            this.userStocks.push({
                name: stock.name,
                symbol: stock.symbol,
                change: stock.change,
                changesPercentage: stock.changesPercentage,
                price: stock.price,
            });
        } else {
            this.userStocks = this.userStocks.filter(f => f.name !== stock.name);
        }


        this.stocksService.updateFollowedStocks({user_id: this.authUser.id, stocks: this.userStocks}).subscribe(dt => {
            this.userStocks = dt.user_stocks;
        });
    }
}
