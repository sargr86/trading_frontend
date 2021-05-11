import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {updateStockDetails} from '@core/helpers/update-stock-details';
import {Subscription} from 'rxjs';
import {LoaderService} from '@core/services/loader.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-stocks-lists',
    templateUrl: './stocks-lists-modal.component.html',
    styleUrls: ['./stocks-lists-modal.component.scss']
})
export class StocksListsModalComponent implements OnInit {
    stockTypes;
    stocks = [];
    selectedStockType;
    stocksLoading = {status: 'idle', text: 'Loading user stocks list and charts'};
    filteredStocks = [];
    filteredUserStocks = [];
    userStocks = [];
    authUser;
    search;
    searched = false;

    public pageSize = 14;
    public pageIndex = 0;

    subscriptions: Subscription[] = [];


    constructor(
        private modalService: BsModalService,
        private dialog: MatDialog,
        private matDialogRef: MatDialogRef<StocksListsModalComponent>,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private loader: LoaderService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.getStocksByType('stocks');
        this.authUser = this.getAuthUser.transform();
        this.subscriptions.push(this.subject.currentStockTypes.subscribe(dt => {
            this.stockTypes = dt;
            this.selectedStockType = dt[0];
            this.getUserStocks({type_id: this.selectedStockType?.id});
        }));
    }

    getUserStocks(params = {}) {
        this.stocksService.getUserStocks({
            user_id: this.authUser.id,
            ...params
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.stocksLoading.text = 'Loading stocks of selected category and charts';
            if (params.hasOwnProperty('close')) {
                this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
            }
        });
    }

    closeModal() {
        this.modalService.hide();
        this.matDialogRef.close();
        this.selectedStockType = null;
        this.getUserStocks({close: true});
    }

    stockTypeChanged(e) {
        this.selectedStockType = this.stockTypes.find(t => t.value === e.target.value);
        this.filteredStocks = [];
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

            this.pageSize = 14;
            this.pageIndex = 0;
            this.filterStocks();
            this.stocksLoading.status = 'finished';
            // const stockNamesList = this.filteredStocks.map(f => f.symbol).join(',');
            // this.getStockGraphsDataByType(stockNamesList, dt);
        });
    }

    getStockGraphsDataByType(stocks, allStocks, filter = false) {
        this.stocksLoading = {status: 'loading', text: 'Loading charts data'};
        if (stocks) {
            this.stocksService.getStockGraphsDataByType({stocks}).subscribe(dt => {
                const st = allStocks.map((item, i) => Object.assign({}, item, dt[i]));
                if (filter) {
                    this.filteredStocks = st;
                } else {
                    this.stocks = st;
                    this.filterStocks();
                }
                this.stocksLoading.status = 'finished';
            });
        } else {
            this.stocksLoading.status = 'finished';
        }

    }

    // Filters routes for floating panel
    filterStocks() {
        this.filteredStocks = this.stocks.slice(this.pageIndex * this.pageSize,
            this.pageIndex * this.pageSize + this.pageSize);
        // this.filteredUserStocks = this.userStocks.slice(this.pageIndex * this.pageSize,
        //     this.pageIndex * this.pageSize + this.pageSize);

    }

    // Handles floating panel routes pagination
    handle(e) {

        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.filterStocks();
        const stockNamesList = this.filteredStocks.map(f => f.symbol).join(',');
        this.getStockGraphsDataByType(stockNamesList, this.filteredStocks, true);
    }

    updateFollowedStocks(stocks) {

        this.stocksLoading.status = 'loading';
        if (stocks.length === 25) {
            this.toastr.error('We support not more than 25 stocks per user');
            this.stocksLoading.status = 'finished';
        } else {
            this.stocksLoading.text = 'Updating stocks lists, details and charts';
            this.stocksService.updateFollowedStocks({
                user_id: this.authUser.id,
                ...{stocks},
                type_id: this.selectedStockType.id
            }).subscribe(dt => {
                this.userStocks = dt?.user_stocks || [];
                this.stocksLoading.status = 'finished';
                this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
            });
        }
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    getUpdatedStockDetails(userStocks) {

        // if (!this.search) {


        // }
        return updateStockDetails(userStocks, this.stocks);
    }

    getSearchResults(e) {
        this.search = e?.search;
        this.searched = true;
        if (this.search) {
            this.stocksLoading.status = 'loading';
            this.stocksLoading.text = 'Searching in the selected category of stocks';
            this.searchInStockType();
        } else {
            this.getStocksByType(this.selectedStockType.value);
        }

    }

    searchInStockType() {
        if (this.search) {
            this.stocksService.searchInStockTypeData({
                search: this.search,
                stockType: this.selectedStockType.value
            }).subscribe((dt: any) => {
                this.stocks = dt;
                // this.stocksLoading.status = 'finished';
                this.filterStocks();
                const stockNamesList = this.filteredStocks.map(f => f.symbol).join(',');
                this.getStockGraphsDataByType(stockNamesList, this.filteredStocks, true);
            });
        }
    }

}
