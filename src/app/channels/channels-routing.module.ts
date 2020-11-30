import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowChannelComponent} from '@app/channels/show-channel/show-channel.component';
import {ShowSubscriptionsComponent} from '@app/channels/show-subscriptions/show-subscriptions.component';


const routes: Routes = [
    {
        path: 'show',
        component: ShowChannelComponent
    },
    {
        path: 'subscriptions',
        component: ShowSubscriptionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannelsRoutingModule {
}
