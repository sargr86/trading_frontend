import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddStockDialogComponent} from '@core/components/modals/add-stock-dialog/add-stock-dialog.component';
import {STOCK_CATEGORIES} from '@core/constants/global';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-crypto-currency',
    templateUrl: './crypto-currency.component.html',
    styleUrls: ['./crypto-currency.component.scss']
})
export class CryptoCurrencyComponent implements OnInit {
    stockTypes = STOCK_CATEGORIES;
    stocks = [];
    selectedStockType = STOCK_CATEGORIES[0].value;
    stocksLoading = 'idle';
    filteredStocks = [];
    userStocks = [];
    authUser;
    search;

    public pageSize = 14;
    public pageIndex = 0;


    constructor(
        private modalService: BsModalService,
        private dialog: MatDialog,
        private matDialogRef: MatDialogRef<CryptoCurrencyComponent>,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {
        this.getStocksByType('stocks');
        this.authUser = this.getAuthUser.transform();
        this.getUserStocks();
    }

    getUserStocks() {
        this.stocksService.getUserStocks({user_id: this.authUser.id}).subscribe(dt => {
            this.userStocks = dt.user_stocks;
        });
    }

    closeModal() {
        this.modalService.hide();
        this.matDialogRef.close();
    }

    openAddStockModal() {
        this.dialog.open(AddStockDialogComponent, {
            data: {
                width: '500px',
                height: '300px'
            }
        }).afterClosed().subscribe(dt => {

        });
    }

    stockTypeChanged(e) {
        this.selectedStockType = e.target.value;
        if (this.search) {
            this.searchInStockType();
        } else {
            this.getStocksByType(this.selectedStockType);
        }
    }

    getStocksByType(type) {
        this.stocksLoading = 'loading';
        this.stocksService.getStocksByType({type}).subscribe(dt => {
            this.stocks = dt;
            this.stocksLoading = 'finished';
            this.filterStocks();
        });
    }

    // Filters routes for floating panel
    filterStocks() {
        this.filteredStocks = this.stocks.slice(this.pageIndex * this.pageSize,
            this.pageIndex * this.pageSize + this.pageSize);
    }

    // Handles floating panel routes pagination
    handle(e) {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.filterStocks();
    }

    followStock(stock) {

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

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    compareWithMainStockList(userStocks) {
        userStocks.map(st => {
            const found = this.stocks.find(fs => fs.name === st.name);
            if (found) {
                st.change = found.change;
                st.changesPercentage = found.changesPercentage;
                st.price = found.price;
                return st;
            }
        });
        return userStocks;
    }

    getSearchResults(e) {
        this.search = e?.search;
        this.stocksLoading = 'loading';
        this.searchInStockType();

    }

    searchInStockType() {
        this.stocksService.searchInStockTypeData({
            search: this.search,
            stockType: this.selectedStockType
        }).subscribe((dt: any) => {
            this.stocks = dt;
            this.stocksLoading = 'finished';
            this.filterStocks();
        });
    }
}
