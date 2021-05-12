import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stock} from '@shared/models/stock';
import {SubjectService} from '@core/services/subject.service';
import {STOCK_TILE_CHART_SETTINGS} from '@core/constants/charts';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {StocksService} from '@core/services/stocks.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-stocks-tiles',
    templateUrl: './stocks-tiles.component.html',
    styleUrls: ['./stocks-tiles.component.scss']
})
export class StocksTilesComponent implements OnInit {

    stockChartSettings = STOCK_TILE_CHART_SETTINGS;
    authUser;

    @Input('stocks') passedStocks: Stock[] = [];
    @Input('userStocks') userStocks: Stock[] = [];
    @Input('type') selectedStockType: Stock | null = null;
    @Input('stocksGeneralList') stocksGeneralList = false;
    @Input('dragDropDisabled') dragDropDisabled = false;
    @Output('updatedStocksList') updatedStocksList = new EventEmitter();
    @Output('updatedStocksPriority') updatedStocksPriority = new EventEmitter();

    constructor(
        private subject: SubjectService,
        private updateStocks: UpdateUserStocksPipe,
        private getAuthUser: GetAuthUserPipe,
        private stocksService: StocksService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    updateFollowedStocksList(stock) {
        const removing = this.isStockFollowed(stock);
        console.log('removing:' + removing, 'length:' + this.userStocks.length)
        if (!removing) {
            if (this.userStocks.length === 25) {
                this.toastr.error('We support not more than 25 stocks per user');
            } else {
                const {userStocks} = this.updateStocks.transform(this.userStocks, stock, this.selectedStockType?.id);
                this.updatedStocksList.emit(userStocks);
                if (!this.stocksGeneralList) {
                    this.passedStocks = userStocks;
                }
            }
        } else {
            const {userStocks} = this.updateStocks.transform(this.userStocks, stock, this.selectedStockType?.id);
            if (!this.stocksGeneralList) {
                this.passedStocks = userStocks;
            }
            this.updatedStocksList.emit(userStocks);
        }

    }

    drop(event: CdkDragDrop<any>) {
        this.passedStocks[event.previousContainer.data.index] = event.container.data.item;
        this.passedStocks[event.container.data.index] = event.previousContainer.data.item;

        this.updatedStocksPriority.emit(this.passedStocks);
    }
}
