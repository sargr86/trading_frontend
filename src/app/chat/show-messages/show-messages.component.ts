import {Component, OnInit} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SocketIoService} from '@core/services/socket-io.service';

import {DatePipe} from '@angular/common';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';


@Component({
    selector: 'app-show-messages',
    templateUrl: './show-messages.component.html',
    styleUrls: ['./show-messages.component.scss']
})
export class ShowMessagesComponent implements OnInit {
    activeTab = 'group';
    authUser;

    groupsMessages = [];
    groupsLoaded = false;
    subscriptions: Subscription[] = [];
    newMessagesCountInGroups = 0;
    newMessagesCountInDirect = 0;

    constructor(
        private chatService: ChatService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        private subject: SubjectService,
        private datePipe: DatePipe,
        private groupBy: GroupByPipe,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getGroupsMessages();
    }


    changeTab(tab) {
        this.activeTab = tab;
    }

    getGroupsMessages() {
        this.subscriptions.push(this.chatService.getGroupsMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.groupsMessages = dt;
            this.groupsLoaded = true;
            const newMessagesSource = dt.filter(fm => fm.new_messages_count > 0);
            console.log(newMessagesSource)
            this.newMessagesCountInGroups = newMessagesSource.length;
            this.subject.setNewMessagesSourceData({source: newMessagesSource, type: 'group'});
        }));
    }


}
