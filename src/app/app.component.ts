import {AfterViewChecked, Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {LoaderService} from '@core/services/loader.service';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import IsResponsive from '@core/helpers/is-responsive';
import {StocksService} from '@core/services/stocks.service';
import {environment} from '@env';
import {STRIPE_CARD_OPTIONS} from '@core/constants/global';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChatService} from '@core/services/chat.service';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '@core/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
    title = '';
    subscriptions: Subscription[] = [];
    pageTitle;

    authUser;
    rightSidenavOpened = false;
    rightSidenavFor;

    chatBoxUser;
    // @todo use this for dark mode toggling
    isDarkModeEnabled = true;

    @HostBinding('class')
    get themeMode() {
        return '';
        // return this.isDarkModeEnabled ? 'theme-dark' : 'theme-light';
    }

    constructor(
        public router: Router,
        private subject: SubjectService,
        public auth: AuthService,
        public loader: LoaderService,
        private titleService: Title,
        private route: ActivatedRoute,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe,
        public groupChatStore: GroupsMessagesSubjectService,
        public usersMessagesStore: UsersMessagesSubjectService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2
    ) {

    }

    ngOnInit() {
        this.authUser = this.getAuthUser.transform();
        this.logInProduction();
        this.setPageTitle();
        this.getStockTypes();
        this.renderer.setAttribute(this.document.body, 'class', this.themeMode);
    }

    logInProduction() {
        // console.log(this.getAuthUser.transform())
        // const player = new Plyr('video', {
        //     captions: {active: true},
        //     quality: {default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]}
        // });
        // console.log(player)
        if (environment.production) {
            console.log = () => {
            };
        }
    }

    setPageTitle() {
        this.subscriptions.push(this.router.events.pipe(map(() => {
            let child = this.route.firstChild;
            while (child) {
                if (child.firstChild) {
                    child = child.firstChild;
                } else if (child.snapshot.data && child.snapshot.data.title) {
                    return child.snapshot.data.title;
                } else {
                    return null;
                }
            }
            return null;
        })).subscribe(title => {
            this.pageTitle = title;
            if (this.router.url === '/chat/messages') {
                this.chatBoxUser = null;
            }
            if (this.pageTitle) {
                this.titleService.setTitle(this.pageTitle);
            }
        }));
    }

    async getSearch(e) {
        if (e.searchType === 'videos') {
            const queryParams = e.search ? {queryParams: e} : {};
            await this.router.navigate(['videos/'], queryParams);
        }
    }

    isLeftSidebarShown() {
        return !this.router.url.includes('auth') && !this.checkIfPolicyPage() && !this.isSmallScreen();
    }

    isRightSidebarShown() {
        return !/auth|chat/.test(this.router.url) && this.rightSidenavOpened && this.rightSidenavFor && this.auth.loggedIn();
    }

    checkIfPolicyPage() {
        return /accessibility-assessment|security|help|privacy-policy|cookie-policy|about-us/.test(this.router.url);
    }

    getSidenavMode(sidenav) {
        // sidenav.toggle();
        // console.log(screen.width, window.innerWidth)
        if (window.innerWidth <= 991 && !this.router.url.includes('auth')) {
            return 'over';
        } else {
            return 'side';
        }
    }

    closeSidenav(close, sidenav) {
        // console.log(close, sidenav)
        // if (this.responsiveMode) {
        if (close) {
            sidenav.close();
        } else {
            sidenav.open();
        }
        // }
    }

    toggleNotifications(e, rightSidenav) {
        rightSidenav.toggle();
        this.rightSidenavOpened = rightSidenav.opened;
        this.rightSidenavFor = e;
    }

    isSmallScreen() {
        return IsResponsive.isSmallScreen();
    }

    getStockTypes() {
        this.stocksService.getStockTypes({}).subscribe(dt => {
            this.subject.changeStockTypes(dt);
        });

        this.stocksService.getStocksSortTypes({}).subscribe(dt => {
            this.subject.changeStockSortTypes(dt);
        });
    }

    ngAfterViewChecked() {
        console.log('after view checked', this.usersMessagesStore.showBottomChatBox)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
