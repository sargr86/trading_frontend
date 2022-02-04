import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {GroupsMessagesSubjectService} from "@core/services/stores/groups-messages-subject.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = '';
    subscriptions: Subscription[] = [];
    pageTitle;

    authUser;
    rightSidenavOpened = false;
    rightSidenavFor;

    chatBoxUser;

    constructor(
        public router: Router,
        private subject: SubjectService,
        public loader: LoaderService,
        private titleService: Title,
        private route: ActivatedRoute,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe,
        private groupChatStore: GroupsMessagesSubjectService

    ) {

    }

    ngOnInit() {
        this.authUser = this.getAuthUser.transform();
        this.logInProduction();
        this.setPageTitle();
        this.getStockTypes();

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
        return !/auth|chat/.test(this.router.url) && this.rightSidenavOpened && this.rightSidenavFor;
    }

    checkIfPolicyPage() {
        return /accessibility-assessment|security|help|privacy-policy|cookie-policy|about-us/.test(this.router.url);
    }

    getSidenavMode(sidenav) {
        // sidenav.toggle();
        if (screen.width <= 991 && !this.router.url.includes('auth')) {
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
