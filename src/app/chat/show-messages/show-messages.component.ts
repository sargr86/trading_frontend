import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();

        this.getGroups();

    }


    changeTab(tab) {
        this.activeTab = tab;
    }

    getGroups() {
        this.chatService.getChatGroups({}).subscribe(dt => {
            this.groupsLoaded = true;
            this.chatGroups = dt;
        });
    }


}
