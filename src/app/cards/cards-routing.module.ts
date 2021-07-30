import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowCardsComponent} from '@app/cards/show-cards/show-cards.component';
import {SaveCardComponent} from '@app/cards/save-card/save-card.component';


const routes: Routes = [
    {
        path: '',
        component: ShowCardsComponent,
        data: {
            title: 'User Cards'
        }
    },
    {
        path: 'add',
        component: SaveCardComponent
    },
    {
        path: 'edit/:id',
        component: SaveCardComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CardsRoutingModule {
}
