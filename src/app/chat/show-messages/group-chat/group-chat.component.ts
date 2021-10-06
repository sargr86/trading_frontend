import {Component, Input, OnInit} from '@angular/core';
import IsResponsive from '@core/helpers/is-responsive';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "@core/services/chat.service";

@Component({
    selector: 'app-group-chat',
    templateUrl: './group-chat.component.html',
    styleUrls: ['./group-chat.component.scss']
})
export class GroupChatComponent implements OnInit {

    groupChatForm: FormGroup;
    showGroupChatForm = false;
    selectedGroup;

    @Input() groups = [];

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService
    ) {
    }

    ngOnInit(): void {
        this.groupChatForm = this.fb.group({
            name: ['', Validators.required]
        });
        this.selectedGroup = this.groups[0];
    }


    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    makeGroupActive(group) {
        this.selectedGroup = group;
    }

    addGroup() {
        this.chatService.addGroup(this.groupChatForm.value).subscribe(dt => {
            this.groups = dt;

        });
    }


}
