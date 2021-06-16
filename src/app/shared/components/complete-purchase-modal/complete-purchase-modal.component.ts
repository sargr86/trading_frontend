import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-complete-purchase-modal',
    templateUrl: './complete-purchase-modal.component.html',
    styleUrls: ['./complete-purchase-modal.component.scss']
})
export class CompletePurchaseModalComponent implements OnInit {
    purchase;
    currentDate = new Date();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private matDialogRef: MatDialogRef<CompletePurchaseModalComponent>
    ) {
        this.purchase = data;
    }

    ngOnInit(): void {
    }

    closeModal(){
        this.matDialogRef.close();
    }

}
