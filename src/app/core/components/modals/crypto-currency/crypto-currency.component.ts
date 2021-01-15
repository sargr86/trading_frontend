import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog} from '@angular/material/dialog';
import {AddStockDialogComponent} from '@core/components/modals/add-stock-dialog/add-stock-dialog.component';

@Component({
    selector: 'app-crypto-currency',
    templateUrl: './crypto-currency.component.html',
    styleUrls: ['./crypto-currency.component.scss']
})
export class CryptoCurrencyComponent implements OnInit {

    constructor(
        private modalService: BsModalService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
    }

    closeModal() {
        this.modalService.hide();
    }

    openAddStockModal() {
        console.log('OK')
        this.dialog.open(AddStockDialogComponent, {data: {width: '500px', height: '300px'}}).afterClosed().subscribe(dt => {

        });
    }

}
