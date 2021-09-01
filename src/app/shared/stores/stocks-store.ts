import { Injectable } from '@angular/core';
import { action, observable} from 'mobx';


@Injectable()
export class StocksStore {
    @observable stocks = [];

    @action setStocks(stocks: any) {
        this.stocks =  stocks;
    }

}

export const stocksStore = new StocksStore();
