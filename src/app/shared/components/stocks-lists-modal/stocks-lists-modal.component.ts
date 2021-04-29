import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AddStockDialogComponent} from '@core/components/modals/add-stock-dialog/add-stock-dialog.component';
import {SubjectService} from '@core/services/subject.service';
import {updateStockDetails} from '@core/helpers/update-stock-details';

@Component({
    selector: 'app-stocks-lists',
    templateUrl: './stocks-lists-modal.component.html',
    styleUrls: ['./stocks-lists-modal.component.scss']
})
export class StocksListsModalComponent implements OnInit {
    stockTypes;
    stocks = [];
    selectedStockType;
    stocksLoading = {status: 'idle', text: 'Loading stocks list and charts'};
    filteredStocks = [];
    userStocks = [];
    authUser;
    search;
    searched = false;

    public pageSize = 14;
    public pageIndex = 0;


    constructor(
        private modalService: BsModalService,
        private dialog: MatDialog,
        private matDialogRef: MatDialogRef<StocksListsModalComponent>,
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
            this.getUserStocks({type_id: this.selectedStockType?.id});
        });
    }

    getUserStocks(params = {}) {
        this.stocksService.getUserStocks({
            user_id: this.authUser.id,
            ...params
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            if (params.hasOwnProperty('close')) {
                this.subject.changeUserStocks(this.userStocks);
            }
        });
    }

    closeModal() {
        this.modalService.hide();
        this.matDialogRef.close();
        this.selectedStockType = null;
        this.getUserStocks({close: true});
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
            this.getUserStocks({type_id: this.selectedStockType.id});
            this.getStocksByType(this.selectedStockType.value);
        }
    }

    getStocksByType(type) {
        this.stocksLoading.status = 'loading';
        this.stocksService.getStocksByType({type}).subscribe(dt => {
            this.stocks = dt;
            this.stocksLoading.status = 'finished';
            this.pageSize = 14;
            this.pageIndex = 0;
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
        this.stocksLoading.status = 'loading';
        this.stocksLoading.text = 'Updating stocks lists, details and charts';
        this.stocksService.updateFollowedStocks({
            user_id: this.authUser.id,
            stocks: e,
            type_id: this.selectedStockType.id
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.stocksLoading.status = 'finished';
        });
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    updateStockDetails(userStocks) {

        // if (!this.search) {


        // }
        return updateStockDetails(userStocks, this.stocks);
    }

    getSearchResults(e) {
        this.search = e?.search;
        this.searched = true;
        this.stocksLoading.status = 'loading';
        this.searchInStockType();

    }

    searchInStockType() {
        this.stocksService.searchInStockTypeData({
            search: this.search,
            stockType: this.selectedStockType.value
        }).subscribe((dt: any) => {
            this.stocks = dt;
            this.stocksLoading.status = 'finished';
            this.filterStocks();
        });
    }

}
