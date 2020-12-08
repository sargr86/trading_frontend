import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowChatroomsComponent} from '@app/chat/show-chatrooms/show-chatrooms.component';
import {ShowMessagesComponent} from '@app/chat/show-messages/show-messages.component';


const routes: Routes = [
    {
        path: 'rooms',
        component: ShowChatroomsComponent
    },
    {
        path: 'messages',
        component: ShowMessagesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatRoutingModule {
}
