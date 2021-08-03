import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardsRoutingModule} from './cards-routing.module';

import {SaveCardComponent} from './save-card/save-card.component';
import {ShowCardsComponent} from '@app/cards/show-cards/show-cards.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
    declarations: [
        SaveCardComponent,
        ShowCardsComponent
    ],
    exports: [
        SaveCardComponent
    ],
    imports: [
        CommonModule,
        CardsRoutingModule,
        SharedModule
    ]
})
export class CardsModule {
}
