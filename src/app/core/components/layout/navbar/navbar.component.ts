import {Component, EventEmitter, OnInit, Output, TemplateRef} from '@angular/core';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {NAVBAR_ADDITIONAL_LINKS} from '@core/constants/global';
import {environment} from '@env';
import {StocksService} from '@core/services/stocks.service';
import {MatDialog} from '@angular/material/dialog';
import {StocksListsModalComponent} from '@shared/components/stocks-lists-modal/stocks-lists-modal.component';
import IsResponsive from '@core/helpers/is-responsive';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    authUser;
    routerUrl;
    isSmallScreen = IsResponsive.isSmallScreen();
    trackByElement = trackByElement;

    envName = environment.envName;


    @Output('search') search = new EventEmitter();
    @Output('closeSidenav') closeSidenav = new EventEmitter();
    additionalLinks = NAVBAR_ADDITIONAL_LINKS;

    passedUsername;

    stocks;

    constructor(
        public router: Router,
        public auth: AuthService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private stocksService: StocksService,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) {

    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();

        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
            } else if (ev instanceof ActivationEnd) {
                this.passedUsername = ev.snapshot.queryParams.username;
            }
        });

        this.getDailyStocks();

    }



    logout() {
        this.auth.logout().subscribe(async () => {
            localStorage.removeItem('token');
            await this.router.navigate(['/']);
        });
    }

    searchVideos(e) {
        // this.subject.setVideosSearch(this.searchVideosForm.value);
        this.search.emit({...e, searchType: 'videos'});
    }

    searchStocks(e) {
        this.search.emit({...e, searchType: 'stocks'});
    }

    toggleMyProfileLink() {
        return !this.router.url.includes('user/profile');
    }

    toggleMyChannelLink() {
        return !this.router.url.includes('channels/show') || this.passedUsername !== this.authUser.username;
    }

    async changePage(l) {
        await this.router.navigate([l.link]);
    }

    getDailyStocks() {
        this.stocksService.getDailyStocks({}).subscribe(dt => {
            this.stocks = dt;
            this.subject.setStocksData(dt);
        });
    }

    getPercentageValue(stock) {
        return stock.changesPercentage.replace(/[(%)]/g, '');
    }



    goToChannelPage() {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            this.router.navigate(['channels/show'], {queryParams: {username: this.authUser.username}})
        );
    }

}
