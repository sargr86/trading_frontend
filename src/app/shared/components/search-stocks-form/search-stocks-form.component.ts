import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivationEnd, Router} from '@angular/router';
import {StocksService} from '@core/services/stocks.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-search-stocks-form',
    templateUrl: './search-stocks-form.component.html',
    styleUrls: ['./search-stocks-form.component.scss']
})
export class SearchStocksFormComponent implements OnInit, OnDestroy {
    searchStocksForm: FormGroup;
    searchResults = [];
    myControl = new FormControl();
    loadingSearchRes = 'idle';
    subscriptions: Subscription[] = [];

    passedSearch;
    @Input('modal') modal = false;
    @Output('search') search = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        public router: Router,
        private stocksService: StocksService
    ) {
    }

    ngOnInit(): void {
        this.searchStocksForm = this.fb.group({search: ['', Validators.required]});
        this.subscriptions.push(this.router.events.subscribe((val) => {
            if (val instanceof ActivationEnd) {
                this.passedSearch = val.snapshot.queryParams?.search;
                this.searchStocksForm.patchValue({search: this.passedSearch});
            }
        }));
    }

    searchStocks() {
        if (!this.modal) {
            this.loadingSearchRes = 'loading';
            this.subscriptions.push(
                this.stocksService.searchStocks(this.searchStocksForm.value).subscribe(dt => {
                    console.log('finished')
                    this.loadingSearchRes = 'finished';
                    this.searchResults = dt;
                }));
        } else {
            this.search.emit(this.searchStocksForm.value);
        }
    }

    async openStockPage(stock, trigger) {
        trigger.closePanel();
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([`stocks/${stock}/analytics`])
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
