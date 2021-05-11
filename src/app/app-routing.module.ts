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
import {PageLoadingComponent} from '@core/components/ungrouped/page-loading/page-loading.component';


const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            title: 'Metl TV',
        }
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
        path: 'stocks',
        loadChildren: () => import('./stocks/stocks.module').then(m => m.StocksModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'videos',
        loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule),
    },
    {
        path: 'trending',
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
        path: 'about',
        component: AboutComponent,
        data: {
            title: 'About',
        }
    },
    {
        path: 'help',
        component: HelpComponent,
        data: {
            title: 'Help',
        }
    },
    {
        path: 'cookie-policy',
        component: CookiePolicyComponent,
        data: {
            title: 'Cookie policy',
        }
    },
    {
        path: 'accessibility-assessment',
        component: AccessibilityStatementComponent,
        data: {
            title: 'Accessibility statement',
        }
    },
    {
        path: 'contact-us',
        component: ContactUsComponent,
        data: {
            title: 'Contact us',
        }
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        data: {
            title: 'Privacy policy',
        }
    },
    {
        path: 'security',
        component: SecurityComponent,
        data: {
            title: 'Security',
        }
    },
    {
        path: 'test',
        component: PageLoadingComponent,
        data: {
            title: 'Security',
        }
    },

    {path: '**', component: NotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
