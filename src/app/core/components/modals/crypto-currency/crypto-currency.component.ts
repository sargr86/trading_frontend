import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog} from '@angular/material/dialog';
import {AddStockDialogComponent} from '@core/components/modals/add-stock-dialog/add-stock-dialog.component';
import {STOCK_CATEGORIES} from '@core/constants/global';
import {StocksService} from '@core/services/stocks.service';

@Component({
    selector: 'app-crypto-currency',
    templateUrl: './crypto-currency.component.html',
    styleUrls: ['./crypto-currency.component.scss']
})
export class CryptoCurrencyComponent implements OnInit {
    stockTypes = STOCK_CATEGORIES;
    stocks = [];

    constructor(
        private modalService: BsModalService,
        private dialog: MatDialog,
        private stocksService: StocksService
    ) {
    }

    ngOnInit(): void {
    }

    closeModal() {
        this.modalService.hide();
    }

    openAddStockModal() {
        console.log('OK')
        this.dialog.open(AddStockDialogComponent, {
            data: {
                width: '500px',
                height: '300px'
            }
        }).afterClosed().subscribe(dt => {

        });
    }

    stockTypeChanged(e) {
        this.stocksService.getStocksByType({type: e.target.value}).subscribe(dt => {
            this.stocks = dt;
        });
    }

}
