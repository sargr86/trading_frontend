import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {VideoJsComponent} from './components/video-js/video-js.component';
import {VideoJsRecordComponent} from './components/video-js-record/video-js-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatBoxComponent} from './components/chat-box/chat-box.component';
import {GetAuthUserPipe} from './pipes/get-auth-user.pipe';
import {BlobToFilePipe} from './pipes/blob-to-file.pipe';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {MaterialModule} from '@core/modules/material.module';
import {Base64ToFilePipe} from './pipes/base64-to-file.pipe';
import {CategoriesComponent} from '@shared/components/categories/categories.component';
import {FilterDevicesPipe} from './pipes/filter-devices.pipe';
import {GetThumbPathPipe} from './pipes/get-thumb-path.pipe';
import {VideoCarouselHolderComponent} from './components/video-carousel-holder/video-carousel-holder.component';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from './pipes/get-selected-videos-to-be-added-to-playlist.pipe';
import {VideoFiltersComponent} from '@shared/components/video-filters/video-filters.component';
import {DateFromNowPipe} from './pipes/date-from-now.pipe';
import {FilterOutFalsyValuesFromObjectPipe} from './pipes/filter-out-falsy-values-from-object.pipe';
import {CheckForEmptyObjectPipe} from './pipes/check-for-empty-object.pipe';
import {UserTagsComponent} from './components/user-tags/user-tags.component';
import {VideosListHolderComponent} from './components/videos-list-holder/videos-list-holder.component';
import {StocksListsModalComponent} from './components/stocks-lists-modal/stocks-lists-modal.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {UpdateUserStocksPipe} from './pipes/update-user-stocks.pipe';
import {SearchStocksFormComponent} from '@shared/components/search-stocks-form/search-stocks-form.component';
import {SearchVideosFormComponent} from '@shared/components/search-videos-form/search-videos-form.component';
import {StockTilesComponent} from './components/stocks-tiles/stock-tiles.component';
import {StocksListComponent} from './components/stocks-list/stocks-list.component';
import {IsStockFollowedPipe} from './pipes/is-stock-followed.pipe';
import {FixTextLineBreaksPipe} from './pipes/fix-text-line-breaks.pipe';
import {VideoRegularPlayerComponent} from './components/video-regular-player/video-regular-player.component';
import {StocksMarqueeComponent} from './components/stocks-marquee/stocks-marquee.component';
import {CompletePurchaseModalComponent} from './components/complete-purchase-modal/complete-purchase-modal.component';
import {NgxPayPalModule} from 'ngx-paypal';
import {CreditCardDirectivesModule} from 'angular-cc-library';
import {NgxStripeModule} from 'ngx-stripe';
import {STRIPE_PUBLISHABLE_KEY} from '@core/constants/global';
import {PaymentsFilterFormComponent} from './components/payments-filter-form/payments-filter-form.component';
import { CapitalizeAddSpacesPipe } from './pipes/capitalize-add-spaces.pipe';
import { GetWalletTablesColumnContentsPipe } from './pipes/get-wallet-tables-column-contents.pipe';

@NgModule({
    declarations: [
        VideoJsComponent,
        VideoJsRecordComponent,
        CategoriesComponent,
        ChatBoxComponent,
        VideoFiltersComponent,
        GetAuthUserPipe,
        BlobToFilePipe,
        Base64ToFilePipe,
        FilterDevicesPipe,
        GetThumbPathPipe,
        VideoCarouselHolderComponent,
        GetSelectedVideosToBeAddedToPlaylistPipe,
        DateFromNowPipe,
        FilterOutFalsyValuesFromObjectPipe,
        CheckForEmptyObjectPipe,
        UserTagsComponent,
        VideosListHolderComponent,
        StocksListsModalComponent,
        UpdateUserStocksPipe,
        SearchStocksFormComponent,
        SearchVideosFormComponent,
        StockTilesComponent,
        StocksListComponent,
        IsStockFollowedPipe,
        FixTextLineBreaksPipe,
        VideoRegularPlayerComponent,
        StocksMarqueeComponent,
        CompletePurchaseModalComponent,
        PaymentsFilterFormComponent,
        CapitalizeAddSpacesPipe,
        GetWalletTablesColumnContentsPipe
    ],
    imports: [
        CommonModule,
        CarouselModule,
        FormsModule,
        ReactiveFormsModule,
        PickerModule,
        MaterialModule,
        DragDropModule,
        NgxChartsModule,
        NgxPayPalModule,
        CreditCardDirectivesModule,
        NgxStripeModule.forRoot(STRIPE_PUBLISHABLE_KEY),
    ],
    providers: [
        GetAuthUserPipe,
        BlobToFilePipe,
        Base64ToFilePipe,
        FilterDevicesPipe,
        GetSelectedVideosToBeAddedToPlaylistPipe,
        FilterOutFalsyValuesFromObjectPipe,
        CheckForEmptyObjectPipe,
        UpdateUserStocksPipe,
        IsStockFollowedPipe,
        FixTextLineBreaksPipe,
        CapitalizeAddSpacesPipe,
        GetWalletTablesColumnContentsPipe
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CarouselModule,
        PickerModule,
        MaterialModule,
        NgxStripeModule,
        VideoJsComponent,
        VideoJsRecordComponent,
        ChatBoxComponent,
        CategoriesComponent,
        FilterDevicesPipe,
        GetThumbPathPipe,
        VideoCarouselHolderComponent,
        VideoFiltersComponent,
        DateFromNowPipe,
        UserTagsComponent,
        CheckForEmptyObjectPipe,
        CapitalizeAddSpacesPipe,
        VideosListHolderComponent,
        StocksListsModalComponent,
        SearchStocksFormComponent,
        SearchVideosFormComponent,
        StockTilesComponent,
        StocksListComponent,
        IsStockFollowedPipe,
        FixTextLineBreaksPipe,
        GetWalletTablesColumnContentsPipe,
        VideoRegularPlayerComponent,
        StocksMarqueeComponent,
        CompletePurchaseModalComponent,
        PaymentsFilterFormComponent
    ]

})
export class SharedModule {
}
