import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ChannelsComponent} from './channels/channels.component';
import {AuthGuard} from '@core/guards/auth.guard';
import {NonAuthGuard} from '@core/guards/non-auth.guard';
import {NotFoundComponent} from '@core/components/not-found/not-found.component';
import {ChatComponent} from '@app/user/chat/chat.component';


const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'channels',
        component: ChannelsComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
        canActivate: [NonAuthGuard]
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivate: [AuthGuard]
    },
    {
        path:'chat',
        component: ChatComponent
    },
    {path: '**', component: NotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
