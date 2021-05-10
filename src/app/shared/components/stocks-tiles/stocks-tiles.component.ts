import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stock} from '@shared/models/stock';
import {SubjectService} from '@core/services/subject.service';
import {STOCK_TILE_CHART_SETTINGS} from '@core/constants/charts';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {StocksService} from '@core/services/stocks.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-stocks-tiles',
    templateUrl: './stocks-tiles.component.html',
    styleUrls: ['./stocks-tiles.component.scss']
})
export class StocksTilesComponent implements OnInit {


    userStocks = [];
    stockChartSettings = STOCK_TILE_CHART_SETTINGS;
    authUser;

    @Input('stocks') passedStocks: Stock[] = [];
    @Output('updatedStocksList') updatedStocksList = new EventEmitter();

    items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    constructor(
        private subject: SubjectService,
        private updateStocks: UpdateUserStocksPipe,
        private getAuthUser: GetAuthUserPipe,
        private stocksService: StocksService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.subject.currentUserStocks.subscribe((dt: any) => {
            this.userStocks = dt.stocks;
        });
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    updateFollowedStocksList(stock) {
        const {userStocks, following} = this.updateStocks.transform(this.userStocks, stock, null);
        this.passedStocks = userStocks;
        this.updatedStocksList.emit(userStocks);
    }

    dragDropped(e, index) {
        this.passedStocks = moveItemInArray(this.passedStocks, e.previousIndex, e.currentIndex);
        console.log("PREVIOUS:" + e.previousIndex, "CURRENT:" + e.currentIndex, "ITEM INDEX:" + index)
        // const sendData = {
        //     order_type: 'custom',
        //     rows: JSON.stringify(this.passedStocks),
        //     user_id: this.authUser.id
        // };
        // this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
        //     localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
        //     this.subject.changeAuthUser((dt.hasOwnProperty('token') ? dt.token : ''));
        // });
    }

    drop(event: CdkDragDrop<any>) {
        this.passedStocks[event.previousContainer.data.index] = event.container.data.item;
        this.passedStocks[event.container.data.index] = event.previousContainer.data.item;

        const sendData = {
            order_type: 'custom',
            rows: JSON.stringify(this.passedStocks),
            user_id: this.authUser.id
        };


        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
            this.subject.changeAuthUser((dt.hasOwnProperty('token') ? dt.token : ''));
        });
    }
}
