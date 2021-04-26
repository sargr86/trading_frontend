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
            this.subscriptions.push(
                this.stocksService.searchStocks({...this.searchStocksForm.value, autocomplete: 1}).subscribe(dt => {
                    console.log('finished')
                    this.loadingSearch = 'finished';
                    this.searchResults = dt;
                }));
        } else {
            this.search.emit(this.searchStocksForm.value);
        }
    }

    async openStockPage(stock, trigger) {
        if (!this.portable) {
            trigger.closePanel();
            this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
                await this.router.navigate([`stocks/${stock}/analytics`])
            );
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
