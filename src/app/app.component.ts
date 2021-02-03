import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = '';

    constructor(
        public router: Router,
        private subject: SubjectService
    ) {

    }

    getSearch(e) {
        const queryParams = e.search ? {queryParams: e} : {};
        this.router.navigate(['videos/'], queryParams);
    }

    checkIfPolicyPage() {
        return /accessibility-assessment|security|help|privacy-policy|cookie-policy|about/.test(this.router.url);
    }
}
