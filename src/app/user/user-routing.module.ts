import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {VideoComponent} from '@app/user/publisher-flow/video/video.component';
import {VideoLibraryComponent} from '@app/user/openvidu-test/video-library/video-library.component';
import {AccessibilityStatementComponent} from '@core/components/ungrouped/accessibility-statement/accessibility-statement.component';
import {CookiePolicyComponent} from '@core/components/ungrouped/cookie-policy/cookie-policy.component';
import {HelpComponent} from '@core/components/ungrouped/help/help.component';
import {AboutComponent} from '@core/components/ungrouped/about/about.component';
import {StockProfileComponent} from '@app/user/created-non-functional/stock-profile/stock-profile.component';
import {PublisherFlowComponent} from '@app/user/publisher-flow/publisher-flow.component';
import {SubscriberFlowComponent} from '@app/user/subscriber-flow/subscriber-flow.component';
import {DoNotLeavePageGuard} from '@core/guards/do-not-leave-page.guard';

const routes: Routes = [
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
        path: 'accessibility-statement',
        component: AccessibilityStatementComponent,
        data: {
            title: 'Accessibility statement',
        }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        data: {
            title: 'User profile',
        }
    },
    {
        path: 'stock-profile',
        component: StockProfileComponent,
        data: {
            title: 'Stock profile',
        }
    },
    {
        path: 'video/check-streaming-requirements',
        component: PublisherFlowComponent,
        data: {
            title: 'Streaming requirements check',
        }
    },
    {
        path: 'video/start-live-video',
        component: PublisherFlowComponent,
        data: {
            title: 'Devices and requirements check',
        }
    },
    {
        path: 'video/publish',
        component: VideoComponent,
        canDeactivate: [DoNotLeavePageGuard],
        data: {
            title: 'Start live streaming',
        }
    },
    {
        path: 'video/watch',
        component: SubscriberFlowComponent,
        data: {
            title: 'Watch live stream',
        }
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
