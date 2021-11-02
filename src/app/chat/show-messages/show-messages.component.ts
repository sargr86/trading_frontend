import {Component, OnInit} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SocketIoService} from '@core/services/socket-io.service';

import {DatePipe} from '@angular/common';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';


@Component({
    selector: 'app-show-messages',
    templateUrl: './show-messages.component.html',
    styleUrls: ['./show-messages.component.scss']
})
export class ShowMessagesComponent implements OnInit {
    activeTab = 'group';
    authUser;

    chatGroups = [];
    groupsLoaded = false;

    constructor(
        private chatService: ChatService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        private datePipe: DatePipe,
        private groupBy: GroupByPipe,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();

        if (this.authUser) {
            this.getGroups();
        }

    }


    changeTab(tab) {
        this.activeTab = tab;
    }

    getGroups() {
        console.log('get groups!!!');
        this.chatService.getChatGroups({user_id: this.authUser.id}).subscribe(dt => {
            this.groupsLoaded = true;
            this.chatGroups = dt;
        });
    }


}
