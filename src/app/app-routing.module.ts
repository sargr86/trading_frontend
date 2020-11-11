import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './user/home/home.component';
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
        loadChildren: () => import('./channels/channels.module').then(m => m.ChannelsModule),
        canActivate: [AuthGuard]
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
        path: 'videos',
        loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule),
    },
    {
        path: 'chat',
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
