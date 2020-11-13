import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {VideoComponent} from '@app/user/video/video.component';
import {VideoLibraryComponent} from '@app/user/video-library/video-library.component';
import {ChatComponent} from './chat/chat.component';
import {AccessibilityStatementComponent} from '../core/components/ungrouped/accessibility-statement/accessibility-statement.component';
import {CookiePolicyComponent} from '../core/components/ungrouped/cookie-policy/cookie-policy.component';
import {HelpComponent} from '../core/components/ungrouped/help/help.component';
import {AboutComponent} from '../core/components/ungrouped/about/about.component';
import {AuthGuard} from '@core/guards/auth.guard';
import {PlayVideoComponent} from '@app/videos/play-video/play-video.component';
import {StockProfileComponent} from '@app/user/stock-profile/stock-profile.component';

const routes: Routes = [
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'help',
        component: HelpComponent
    },
    {
        path: 'cookie-policy',
        component: CookiePolicyComponent
    },
    {
        path: 'accessibility-statement',
        component: AccessibilityStatementComponent
    },
    {
        path: 'chat',
        component: ChatComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'stock-profile',
        component: StockProfileComponent
    },
    {
        path: 'video/publish',
        component: VideoComponent,
    },
    {
        path: 'video/watch',
        component: VideoComponent
    },
    {
        path: 'video-library',
        component: VideoLibraryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
