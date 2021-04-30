import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {LoaderService} from '@core/services/loader.service';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import IsResponsive from '@core/helpers/is-responsive';
import {StocksService} from '@core/services/stocks.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = '';
    subscriptions: Subscription[] = [];
    pageTitle;
    isSmallScreen = IsResponsive.isSmallScreen();

    constructor(
        public router: Router,
        private subject: SubjectService,
        public loader: LoaderService,
        private titleService: Title,
        private route: ActivatedRoute,
        private stocksService: StocksService
    ) {

    }

    ngOnInit() {
        // const player = new Plyr('video', {
        //     captions: {active: true},
        //     quality: {default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]}
        // });
        // console.log(player)

        this.getStockTypes();

        // Getting current page title
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

    checkIfPolicyPage() {
        return /accessibility-assessment|security|help|privacy-policy|cookie-policy|about/.test(this.router.url);
    }


    getMode(sidenav) {

        // sidenav.toggle();
        if (screen.width <= 991 && !this.router.url.includes('auth')) {
            return 'over';
        } else {
            return 'side';
        }
    }

    closeSidenav(close, sidenav) {
        // if (this.responsiveMode) {
        if (close) {
            sidenav.close();
        } else {
            sidenav.open();
        }
        // }
    }

    getStockTypes() {
        this.stocksService.getStockTypes({}).subscribe(dt => {
            this.subject.changeStockTypes(dt);
            // this.selectedStockType = dt[0];
        });
    }
}
