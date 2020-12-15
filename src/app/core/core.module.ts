import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './components/layout/navbar/navbar.component';
import {LeftSidebarComponent} from './components/layout/left-sidebar/left-sidebar.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {CryptoCurrencyComponent} from '@core/components/modals/crypto-currency/crypto-currency.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PurchaseBitsComponent} from '@core/components/modals/purchase-bits/purchase-bits.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotFoundComponent} from './components/ungrouped/not-found/not-found.component';
import {MaterialModule} from '@core/modules/material.module';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AboutComponent} from './components/ungrouped/about/about.component';
import {AccessibilityStatementComponent} from '@core/components/ungrouped/accessibility-statement/accessibility-statement.component';
import { ContactUsComponent } from './components/ungrouped/contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './components/ungrouped/privacy-policy/privacy-policy.component';
import { SecurityComponent } from './components/ungrouped/security/security.component';
import { StreamPreviewDialogComponent } from './components/modals/stream-preview-dialog/stream-preview-dialog.component';
import {SharedModule} from '@shared/shared.module';
import { AddPlaylistDialogComponent } from './components/modals/add-playlist-dialog/add-playlist-dialog.component';
import { AddVideoToPlaylistDialogComponent } from './components/modals/add-video-to-playlist-dialog/add-video-to-playlist-dialog.component';
import { SearchVideosFormComponent } from './components/ungrouped/search-videos-form/search-videos-form.component';
import { ConfirmationDialogComponent } from './components/modals/confirmation-dialog/confirmation-dialog.component';
import { AddVideoToAnotherPlaylistComponent } from './components/modals/add-video-to-another-playlist/add-video-to-another-playlist.component';


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
        StreamPreviewDialogComponent,
        AddPlaylistDialogComponent,
        AddVideoToPlaylistDialogComponent,
        SearchVideosFormComponent,
        ConfirmationDialogComponent,
        AddVideoToAnotherPlaylistComponent,
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
