import {Component, OnInit} from '@angular/core';
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

    stockTypes;
    stocks = [];
    selectedStockType;
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
        this.getStockTypes();

    }

    getStockTypes() {
        this.stocksService.getStockTypes({}).subscribe(dt => {
            this.stockTypes = dt;
            this.selectedStockType = dt[0];
            this.getUserStocks();
        });
    }

    getUserStocks() {
        this.stocksService.getUserStocks({
            user_id: this.authUser.id,
            type_id: this.selectedStockType?.id
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
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
        this.selectedStockType = this.stockTypes.find(t => t.value === e.target.value);
        if (this.search) {
            this.searchInStockType();
        } else {
            this.getUserStocks();
            this.getStocksByType(this.selectedStockType.value);
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

    updateFollowedStocks(e) {
        this.stocksService.updateFollowedStocks({
            user_id: this.authUser.id,
            stocks: e,
            type_id: this.selectedStockType.id
        }).subscribe(dt => {
            this.userStocks = dt.user_stocks;
        });
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    compareWithMainStockList(userStocks) {

        if (!this.search) {

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
        }
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
            stockType: this.selectedStockType.value
        }).subscribe((dt: any) => {
            this.stocks = dt;
            this.stocksLoading = 'finished';
            this.filterStocks();
        });
    }

}
