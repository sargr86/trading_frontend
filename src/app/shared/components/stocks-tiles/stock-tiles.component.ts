import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stock} from '@shared/models/stock';
import {SubjectService} from '@core/services/subject.service';
import {STOCK_TILE_CHART_SETTINGS} from '@core/constants/charts';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-stock-tiles',
    templateUrl: './stock-tiles.component.html',
    styleUrls: ['./stock-tiles.component.scss']
})
export class StockTilesComponent implements OnInit {

    stockChartSettings = STOCK_TILE_CHART_SETTINGS;
    authUser;

    @Input('stocks') passedStocks: Stock[] = [];
    @Input('userStocks') userStocks: Stock[] = [];
    @Input('type') selectedStockType: Stock | null = null;
    @Input('allStocksList') allStocksList = false;
    @Input('dragDropDisabled') dragDropDisabled = false;
    @Output('updatedStocksList') updatedStocksList = new EventEmitter();
    @Output('updatedStocksPriority') updatedStocksPriority = new EventEmitter();

    constructor(
        private subject: SubjectService,
        private updateStocks: UpdateUserStocksPipe,
        private getAuthUser: GetAuthUserPipe,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    updateFollowedStocksList(stock) {
        const result = this.updateStocks.transform(this.userStocks, stock, this.isStockFollowed(stock));
        if (result) {
            if (!this.allStocksList) {
                this.passedStocks = result;
            }
            this.updatedStocksList.emit(result);
        }
    }

    drop(event: CdkDragDrop<any>) {
        this.passedStocks[event.previousContainer.data.index] = event.container.data.item;
        this.passedStocks[event.container.data.index] = event.previousContainer.data.item;

        this.updatedStocksPriority.emit(this.passedStocks);
    }
}