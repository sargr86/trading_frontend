import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MAIN_SECTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {environment} from '@env';
import {AuthService} from '@core/services/auth.service';
import trackByElement from '@core/helpers/track-by-element';
import {SocketIoService} from '@core/services/socket-io.service';
import {ChatService} from '@core/services/chat.service';

@Component({
    selector: 'app-section-links',
    templateUrl: './section-links.component.html',
    styleUrls: ['./section-links.component.scss']
})
export class SectionLinksComponent implements OnInit {
    mainSections = MAIN_SECTIONS;
    envName;
    newMessage = false;
    usersMessages = [];
    trackByElement = trackByElement;

    @Input() authUser;
    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor(
        public router: Router,
        public auth: AuthService,
        private socketService: SocketIoService,
        private chatService: ChatService
    ) {
    }

    ngOnInit(): void {
        this.envName = environment.envName;
        this.getMessagesFromSocket();

        if (this.auth.loggedIn()) {
            this.getUserMessages();
        }
    }

    getUserMessages() {
        this.chatService.getDirectChatMessages({from_id: this.authUser.id, to_id: ''}).subscribe(dt => {
            this.usersMessages = dt;
            this.newMessage = !!dt.filter(d => !d.seen && d.from_id !== this.authUser.id).length;
            console.log('New Message')
        });
    }

    getMessagesFromSocket() {
        this.socketService.onNewMessage().subscribe((dt: any) => {
            console.log('new message')
            this.newMessage = true;
        });
    }


    changePage(route, params = {}) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([route], {queryParams: params})
        );
    }

}
