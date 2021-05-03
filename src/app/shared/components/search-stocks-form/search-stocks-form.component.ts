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
    loadingSearch = 'idle';
    subscriptions: Subscription[] = [];

    passedSearch;
    @Input('modal') modal = false;
    @Input('portable') portable = false;
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
            this.loadingSearch = 'loading';
            this.searchResults = [];
            this.subscriptions.push(
                this.stocksService.searchStocks({
                    ...this.searchStocksForm.value,
                    grouped: this.portable ? 0 : 1
                }).subscribe(dt => {
                    this.loadingSearch = 'finished';
                    if (this.portable) {

                        this.searchResults = dt?.[0]?.stocks.slice(0, 10);
                    } else {

                        this.searchResults = dt.slice(0, 10);
                    }
                }));
        } else if (this.portable) {
            this.stocksService.searchStocksBySymbol({...this.searchStocksForm.value}).subscribe(dt => {
                this.loadingSearch = 'finished';
                this.searchResults = dt;
            });
        } else {
            this.search.emit(this.searchStocksForm.value);
        }
    }

    async openStockPage(stock, trigger) {
        if (!this.modal) {
            trigger.closePanel();
            this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
                await this.router.navigate([`stocks/${stock.symbol || stock}/analytics`])
            );
        } else {
            this.searchStocks();
            this.search.emit(this.searchStocksForm.value);
        }
    }

    sendBack(stock, trigger) {
        trigger.closePanel();
        this.search.emit(stock);
        this.searchStocksForm.reset();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
