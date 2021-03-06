import {Component, EventEmitter, OnInit, Output, TemplateRef} from '@angular/core';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NAVBAR_ADDITIONAL_LINKS} from '@core/constants/global';
import {environment} from '@env';
import {StocksService} from '@core/services/stocks.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    modalRef: BsModalRef;
    authUser;
    routerUrl;

    envName = environment.envName;


    @Output('search') search = new EventEmitter();
    @Output('closeSidenav') closeSidenav = new EventEmitter();
    additionalLinks = NAVBAR_ADDITIONAL_LINKS;

    passedUsername;

    stocks;

    constructor(
        public router: Router,
        public auth: AuthService,
        private modalService: BsModalService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private stocksService: StocksService,
        private route: ActivatedRoute
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

        this.stocksService.getDailyStocks({}).subscribe(dt => {
            this.stocks = dt;
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    logout() {
        this.auth.logout().subscribe(async () => {
            localStorage.removeItem('token');
            await this.router.navigate(['/']);
        });
    }

    searchVideos(e) {
        // this.subject.setVideosSearch(this.searchVideosForm.value);
        this.search.emit(e);
    }

    toggleMyProfileLink() {
        return !this.router.url.includes('user/profile');
    }

    toggleMyChannelLink() {
        return !this.router.url.includes('channels/show') || this.passedUsername !== this.authUser.username;
    }

    changePage(l) {
        this.router.navigate([l.link])
    }

    getDailyStocks() {

    }

    isSmallScreen() {
        return window.screen.availWidth < 992;
    }

    getPercentageValue(stock) {
        return stock.changesPercentage.replace(/[(%)]/g, '');
    }

    getPercentageColor(stock) {
        return 'black-percent-' + (+this.getPercentageValue(stock) > 0 ? 'green' : 'red');
    }

    getPercentageDetails(stock) {
        const value = stock.changesPercentage.replace(/[(%)]/g, '');
        return {...{value}, color: 'black-percent-' + (+value > 0 ? 'green' : 'red')};

    }

}
