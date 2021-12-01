import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowChannelComponent} from '@app/channels/show-channel/show-channel.component';


const routes: Routes = [
    {
        path: 'show',
        component: ShowChannelComponent,
        data: {
            title: 'Channel page'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannelsRoutingModule {
}
