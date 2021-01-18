import {Component, OnInit} from '@angular/core';
import {StreamPreviewDialogComponent} from '@core/components/modals/stream-preview-dialog/stream-preview-dialog.component';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-publisher-flow',
    templateUrl: './publisher-flow.component.html',
    styleUrls: ['./publisher-flow.component.scss']
})
export class PublisherFlowComponent implements OnInit {

    videoSettings;
    sessionData = {sessionName: '', myUserName: ''};
    requirementsChecked = false;

    constructor(
        private subject: SubjectService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

    getPublisherData(e) {
        this.sessionData = {sessionName: e.sessionName, myUserName: e.myUserName};
        this.videoSettings = e;
        this.subject.setSessionData(this.sessionData);
        localStorage.setItem('session', JSON.stringify(this.sessionData));
        localStorage.setItem('video_settings', JSON.stringify(this.videoSettings));
        this.router.navigate(['user/video/publish']);
    }

}
