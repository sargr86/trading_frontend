import {Component, OnInit} from '@angular/core';
import {STOCK_CATEGORIES} from '@core/constants/global';
import {BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AddStockDialogComponent} from '@core/components/modals/add-stock-dialog/add-stock-dialog.component';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-stocks-lists',
    templateUrl: './stocks-lists.component.html',
    styleUrls: ['./stocks-lists.component.scss']
})
export class StocksListsComponent implements OnInit {

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
        private matDialogRef: MatDialogRef<StocksListsComponent>,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService
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
        this.matDialogRef.close(this.userStocks);
        this.subject.setUserStocksData(this.userStocks);
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

    followStock(e) {
        this.stocksService.updateFollowedStocks({user_id: this.authUser.id, stocks: e}).subscribe(dt => {
            this.userStocks = dt.user_stocks;
        });
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    compareWithMainStockList(userStocks) {
        // console.log(this.stocks)
        userStocks.map(st => {
            const found = this.stocks.find(fs => fs.name === st.name);
            // console.log(found)
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
