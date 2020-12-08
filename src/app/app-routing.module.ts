import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './user/home/home.component';
import {AuthGuard} from '@core/guards/auth.guard';
import {NonAuthGuard} from '@core/guards/non-auth.guard';
import {NotFoundComponent} from '@core/components/ungrouped/not-found/not-found.component';
import {AccessibilityStatementComponent} from '@app/core/components/ungrouped/accessibility-statement/accessibility-statement.component';
import {AboutComponent} from '@core/components/ungrouped/about/about.component';
import {CookiePolicyComponent} from '@core/components/ungrouped/cookie-policy/cookie-policy.component';
import {PrivacyPolicyComponent} from '@core/components/ungrouped/privacy-policy/privacy-policy.component';
import {SecurityComponent} from '@core/components/ungrouped/security/security.component';
import {HelpComponent} from '@core/components/ungrouped/help/help.component';
import {ContactUsComponent} from '@core/components/ungrouped/contact-us/contact-us.component';


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
        path: 'trendings',
        loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule),
    },
    {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
    },
    {
        path: 'playlists',
        loadChildren: () => import('./playlists/playlists.module').then(m => m.PlaylistsModule),
    },
    {
        path: 'accessibility-assessment',
        component: AccessibilityStatementComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'contact-us',
        component: ContactUsComponent
    },
    {
        path: 'cookie-policy',
        component: CookiePolicyComponent
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
    },
    {
        path: 'security',
        component: SecurityComponent
    },
    {
        path: 'help',
        component: HelpComponent
    },


    {path: '**', component: NotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
