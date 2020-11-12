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
        this.subject.getVideosSearch().subscribe((data) => {
            console.log(data)
        });

    }

    getSearch(e) {
        this.router.navigate(['videos/'], {queryParams: e});
        console.log(e)
    }
}
