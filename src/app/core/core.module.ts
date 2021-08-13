import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '@core/components/layout/navbar/navbar.component';
import {LeftSidebarComponent} from '@core/components/layout/left-sidebar/left-sidebar.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PurchaseBitsComponent} from '@core/components/modals/purchase-bits/purchase-bits.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotFoundComponent} from '@core/components/ungrouped/not-found/not-found.component';
import {MaterialModule} from '@core/modules/material.module';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AboutComponent} from '@core/components/ungrouped/about/about.component';
import {AccessibilityStatementComponent} from '@core/components/ungrouped/accessibility-statement/accessibility-statement.component';
import {ContactUsComponent} from '@core/components/ungrouped/contact-us/contact-us.component';
import {PrivacyPolicyComponent} from '@core/components/ungrouped/privacy-policy/privacy-policy.component';
import {SecurityComponent} from '@core/components/ungrouped/security/security.component';
import {SharedModule} from '@shared/shared.module';
import {AddPlaylistDialogComponent} from '@core/components/modals/add-playlist-dialog/add-playlist-dialog.component';
import {AddVideoToPlaylistDialogComponent} from '@core/components/modals/add-video-to-playlist-dialog/add-video-to-playlist-dialog.component';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {AddVideoToAnotherPlaylistComponent} from '@core/components/modals/add-video-to-another-playlist/add-video-to-another-playlist.component';
import {SearchVideosTabComponent} from '@core/components/modals/add-video-to-playlist-dialog/search-videos-tab/search-videos-tab.component';
import {VideoUrlTabComponent} from '@core/components/modals/add-video-to-playlist-dialog/video-url-tab/video-url-tab.component';
import {YourVideosTabComponent} from '@core/components/modals/add-video-to-playlist-dialog/your-videos-tab/your-videos-tab.component';
import {AddStockDialogComponent} from './components/modals/add-stock-dialog/add-stock-dialog.component';
import {SectionLinksComponent} from '@core/components/layout/left-sidebar/section-links/section-links.component';
import { ChannelSubscriptionsComponent } from './components/layout/left-sidebar/channel-subscriptions/channel-subscriptions.component';
import { StocksListsPortableComponent } from './components/layout/left-sidebar/stocks-lists-portable/stocks-lists-portable.component';
import { PageLoadingComponent } from './components/ungrouped/page-loading/page-loading.component';
import {StocksListsTabsComponent} from '@core/components/layout/left-sidebar/stocks-lists-portable/stocks-lists-tabs/stocks-lists-tabs.component';
import {CreditCardDirectivesModule} from 'angular-cc-library';
import {TurboPlanComponent} from "@core/components/ungrouped/turbo-plan/turbo-plan.component";
import { PurchaseCoinsComponent } from './components/modals/purchase-coins/purchase-coins.component';


@NgModule({
    declarations: [
        NavbarComponent,
        LeftSidebarComponent,
        PurchaseBitsComponent,
        NotFoundComponent,
        AccessibilityStatementComponent,
        AboutComponent,
        ContactUsComponent,
        PrivacyPolicyComponent,
        SecurityComponent,
        AddPlaylistDialogComponent,
        AddVideoToPlaylistDialogComponent,
        ConfirmationDialogComponent,
        AddVideoToAnotherPlaylistComponent,
        SearchVideosTabComponent,
        VideoUrlTabComponent,
        YourVideosTabComponent,
        AddStockDialogComponent,
        SectionLinksComponent,
        ChannelSubscriptionsComponent,
        StocksListsPortableComponent,
        PageLoadingComponent,
        StocksListsTabsComponent,
        TurboPlanComponent,
        PurchaseCoinsComponent
    ],
    imports: [
        CommonModule,
        DragDropModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,

        CreditCardDirectivesModule
    ],
    exports: [
        NavbarComponent,
        LeftSidebarComponent,
        PurchaseBitsComponent,
        StocksListsPortableComponent,
    ],
    entryComponents: [],
    providers: [
        GetAuthUserPipe
    ]
})
export class CoreModule {
}
