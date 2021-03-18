import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
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
        private matDialogRef: MatDialogRef<CryptoCurrencyComponent>,
        private stocksService: StocksService
    ) {
    }

    ngOnInit(): void {
        this.getStocksByType('stocks');
    }

    closeModal() {
        this.modalService.hide();
        this.matDialogRef.close();
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
        this.getStocksByType(e.target.value);
    }

    getStocksByType(type) {
        this.stocksService.getStocksByType({type}).subscribe(dt => {
            this.stocks = dt;
        });
    }

}
