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
        if (this.userStocks.length < 25) {
            const {userStocks} = this.updateStocks.transform(this.userStocks, stock, this.selectedStockType?.id);
            if (!this.stocksGeneralList) {
                this.passedStocks = userStocks;
            }
            this.updatedStocksList.emit(userStocks);
        } else {
            this.toastr.error('We support not more than 25 stocks per user');
        }
    }

    drop(event: CdkDragDrop<any>) {
        this.passedStocks[event.previousContainer.data.index] = event.container.data.item;
        this.passedStocks[event.container.data.index] = event.previousContainer.data.item;

        const sendData = {
            order_type: 'custom',
            rows: JSON.stringify(this.passedStocks),
            user_id: this.authUser.id
        };

        this.subject.changeUserStocks({stocks: this.passedStocks, dragdrop: true});
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
        });
    }
}
