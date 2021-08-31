import { Injectable } from '@angular/core';
import { action, observable} from 'mobx';


@Injectable()
export class CardsStore {
    @observable cards = [];

    @action setCards(cards: any) {
        this.cards =  cards;
    }

}

export const cardsStore = new CardsStore();
