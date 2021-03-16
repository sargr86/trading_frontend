import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '@core/components/layout/navbar/navbar.component';
import {LeftSidebarComponent} from '@core/components/layout/left-sidebar/left-sidebar.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {CryptoCurrencyComponent} from '@core/components/modals/crypto-currency/crypto-currency.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PurchaseBitsComponent} from '@core/components/modals/purchase-bits/purchase-bits.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotFoundComponent} from '@core/components/ungrouped/not-found/not-found.component';
import {MaterialModule} from '@core/modules/material.module';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AboutComponent} from '@core/components/ungrouped/about/about.component';
import {AccessibilityStatementComponent} from '@core/components/ungrouped/accessibility-statement/accessibility-statement.component';
import { ContactUsComponent } from '@core/components/ungrouped/contact-us/contact-us.component';
import { PrivacyPolicyComponent } from '@core/components/ungrouped/privacy-policy/privacy-policy.component';
import { SecurityComponent } from '@core/components/ungrouped/security/security.component';
import {SharedModule} from '@shared/shared.module';
import { AddPlaylistDialogComponent } from '@core/components/modals/add-playlist-dialog/add-playlist-dialog.component';
import { AddVideoToPlaylistDialogComponent } from '@core/components/modals/add-video-to-playlist-dialog/add-video-to-playlist-dialog.component';
import { SearchVideosFormComponent } from '@core/components/ungrouped/search-videos-form/search-videos-form.component';
import { ConfirmationDialogComponent } from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import { AddVideoToAnotherPlaylistComponent } from '@core/components/modals/add-video-to-another-playlist/add-video-to-another-playlist.component';
import { SearchVideosTabComponent } from '@core/components/modals/add-video-to-playlist-dialog/search-videos-tab/search-videos-tab.component';
import { VideoUrlTabComponent } from '@core/components/modals/add-video-to-playlist-dialog/video-url-tab/video-url-tab.component';
import {YourVideosTabComponent} from '@core/components/modals/add-video-to-playlist-dialog/your-videos-tab/your-videos-tab.component';
import { AddStockDialogComponent } from './components/modals/add-stock-dialog/add-stock-dialog.component';
import { SearchStocksFormComponent } from './components/ungrouped/search-stocks-form/search-stocks-form.component';


@NgModule({
    declarations: [
        NavbarComponent,
        LeftSidebarComponent,
        CryptoCurrencyComponent,
        PurchaseBitsComponent,
        NotFoundComponent,
        AccessibilityStatementComponent,
        AboutComponent,
        ContactUsComponent,
        PrivacyPolicyComponent,
        SecurityComponent,
        AddPlaylistDialogComponent,
        AddVideoToPlaylistDialogComponent,
        SearchVideosFormComponent,
        ConfirmationDialogComponent,
        AddVideoToAnotherPlaylistComponent,
        SearchVideosTabComponent,
        VideoUrlTabComponent,
        YourVideosTabComponent,
        AddStockDialogComponent,
        SearchStocksFormComponent
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
        SharedModule
    ],
    exports: [
        NavbarComponent,
        LeftSidebarComponent,
        PurchaseBitsComponent
    ],
    entryComponents: [
        // CryptoCurrencyComponent
    ],
    providers: [
        GetAuthUserPipe
    ]
})
export class CoreModule {
}
