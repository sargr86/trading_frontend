import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MAIN_SECTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {environment} from '@env';
import {AuthService} from '@core/services/auth.service';
import trackByElement from '@core/helpers/track-by-element';
import {SocketIoService} from '@core/services/socket-io.service';
import {ChatService} from '@core/services/chat.service';
import {SubjectService} from "@core/services/subject.service";

@Component({
    selector: 'app-section-links',
    templateUrl: './section-links.component.html',
    styleUrls: ['./section-links.component.scss']
})
export class SectionLinksComponent implements OnInit {
    mainSections = MAIN_SECTIONS;
    envName;
    newMessagesLen = 0;
    usersMessages = [];
    trackByElement = trackByElement;

    @Input() authUser;
    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor(
        public router: Router,
        public auth: AuthService,
        private socketService: SocketIoService,
        private subject: SubjectService,
        private chatService: ChatService
    ) {
    }

    ngOnInit(): void {
        this.envName = environment.envName;

        this.subject.getNewMessagesSourceLenData().subscribe(len => {
            this.newMessagesLen = len;
            console.log('received:', len)
        });

        if (this.auth.loggedIn()) {
            this.getUserMessages();
        }
    }

    getUserMessages() {
        this.chatService.getDirectChatMessages({from_id: this.authUser.id, to_id: ''}).subscribe(dt => {
            this.usersMessages = dt;
            // console.log(dt)
            this.newMessagesLen = [...new Set(dt.filter(d => !d.seen && d.from_id !== this.authUser.id).map(obj => obj.from_id))].length;
            console.log('New Message', this.newMessagesLen)
        });
    }


    changePage(route, params = {}) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([route], {queryParams: params})
        );
    }

}
