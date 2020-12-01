import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowChatroomsComponent} from '@app/chat/show-chatrooms/show-chatrooms.component';


const routes: Routes = [
    {
        path: 'rooms',
        component: ShowChatroomsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatRoutingModule {
}
