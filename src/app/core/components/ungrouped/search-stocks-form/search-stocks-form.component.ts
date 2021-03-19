import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivationEnd, Router} from '@angular/router';
import {StocksService} from '@core/services/stocks.service';

@Component({
    selector: 'app-search-stocks-form',
    templateUrl: './search-stocks-form.component.html',
    styleUrls: ['./search-stocks-form.component.scss']
})
export class SearchStocksFormComponent implements OnInit {
    searchStocksForm: FormGroup;
    searchResults = [];
    myControl = new FormControl();

    passedSearch;
    @Output('search') search = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        public router: Router,
        private stocksService: StocksService
    ) {
    }

    ngOnInit(): void {
        this.searchStocksForm = this.fb.group({search: ['', Validators.required]});
        this.router.events.subscribe((val) => {
            if (val instanceof ActivationEnd) {
                this.passedSearch = val.snapshot.queryParams?.search;
                this.searchStocksForm.patchValue({search: this.passedSearch});
            }
        });
    }

    searchStocks() {
        this.stocksService.searchStocks(this.searchStocksForm.value).subscribe(dt => {
            this.searchResults = dt;
        });
    }

    async openStockPage(stock, trigger) {
        console.log(stock)
        trigger.closePanel();
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([`stocks/${stock}/analytics`])
        );
    }

}
