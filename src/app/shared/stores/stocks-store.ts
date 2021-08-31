import { Injectable } from '@angular/core';
import { action, observable} from 'mobx';


@Injectable()
export class CardsStore {
    @observable stocks = [];

    @action setStocks(stocks: any) {
        this.stocks =  stocks;
    }

}

export const cardsStore = new CardsStore();
