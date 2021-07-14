import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-payments-filter-form',
    templateUrl: './payments-filter-form.component.html',
    styleUrls: ['./payments-filter-form.component.scss']
})
export class PaymentsFilterFormComponent implements OnInit {
    paymentsFilterForm: FormGroup;
    datesRange = {};

    @Output() formReady = new EventEmitter();

    constructor(
        private fb: FormBuilder
    ) {
        this.paymentsFilterForm = this.fb.group({
            gte: [],
            lte: []
        });
    }

    ngOnInit(): void {
    }


    dateChanged(e, control) {
        this.paymentsFilterForm.controls[control].patchValue(e.value);
        this.datesRange[control] = moment(e.value).format('X');
        this.formReady.emit(this.datesRange);
    }

}
