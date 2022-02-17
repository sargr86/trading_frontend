import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {MAIN_SECTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {environment} from '@env';
import {AuthService} from '@core/services/auth.service';
import trackByElement from '@core/helpers/track-by-element';
import {SocketIoService} from '@core/services/socket-io.service';
import {ChatService} from '@core/services/chat.service';
import {SubjectService} from '@core/services/subject.service';
import {Subscription} from 'rxjs';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-section-links',
    templateUrl: './section-links.component.html',
    styleUrls: ['./section-links.component.scss']
})
export class SectionLinksComponent implements OnInit, OnDestroy, AfterViewChecked {
    mainSections = MAIN_SECTIONS;
    envName;
    newMessageSources = 0;
    usersMessages = [];
    subscriptions: Subscription[] = []
    trackByElement = trackByElement;

    @Input() authUser;
    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor(
        public router: Router,
        public auth: AuthService,
        private socketService: SocketIoService,
        private subject: SubjectService,
        private chatService: ChatService,
        private usersMessagesStore: UserMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.envName = environment.envName;
        // let directNewMessagesCount = 0;
        // let groupNewMessagesCount = 0;
        // this.subscriptions.push(this.subject.getNewMessagesSourceData().subscribe(data => {
        //     // console.log('new messages from ' + data.type + ':' + this.newMessageSources)
        //     if (data.type === 'direct') {
        //
        //         directNewMessagesCount = data.sources;
        //     } else {
        //         groupNewMessagesCount = data.sources || 0;
        //         // console.log(groupNewMessagesCount)
        //     }
        //     this.newMessageSources = directNewMessagesCount + groupNewMessagesCount;
        //     // console.log('received:', directNewMessagesCount, groupNewMessagesCount)
        // }));

    }


    changePage(route, params = {}) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([route], {queryParams: params})
        );
    }

    getUnreadMessagesCount() {

        const directMessages = this.usersMessagesStore.userMessages
            ?.filter(m => m.direct_messages
                ?.filter(d => !d.seen && d.from_id !== this.authUser.id).length > 0).length;

        const groupMessages = this.groupsMessagesStore.groupsMessages
            ?.filter(m => {
                return m.group_messages
                    ?.find(message => {
                        let found = false;
                        if (message.from_id !== this.authUser.id) {
                            found = !message.seen.find(sb => sb.seen_by.id === this.authUser.id);
                        }
                        return found;
                    });
            }).length;
        return directMessages + groupMessages;
    }

    ngAfterViewChecked() {
        this.newMessageSources = this.getUnreadMessagesCount();
        this.cdr.detectChanges();
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
