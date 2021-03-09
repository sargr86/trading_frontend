import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import * as Plyr from 'plyr';
import {LoaderService} from '@core/services/loader.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = '';

    constructor(
        public router: Router,
        private subject: SubjectService,
        public loader: LoaderService
    ) {

    }

    ngOnInit() {
        // const player = new Plyr('video', {
        //     captions: {active: true},
        //     quality: {default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]}
        // });
        // console.log(player)
    }

    async getSearch(e) {
        const queryParams = e.search ? {queryParams: e} : {};
        await this.router.navigate(['videos/'], queryParams);
    }

    checkIfPolicyPage() {
        return /accessibility-assessment|security|help|privacy-policy|cookie-policy|about/.test(this.router.url);
    }


    getMode(sidenav) {

        // sidenav.toggle();
        if (screen.width < 767 && !this.router.url.includes('auth')) {
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

    isSmallScreen() {
        return window.screen.availWidth < 768;
    }
}
