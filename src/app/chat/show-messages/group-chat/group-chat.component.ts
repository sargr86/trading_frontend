import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import IsResponsive from '@core/helpers/is-responsive';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '@core/services/chat.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {UsersService} from "@core/services/users.service";
import {Observable, of} from "rxjs";

@Component({
    selector: 'app-group-chat',
    templateUrl: './group-chat.component.html',
    styleUrls: ['./group-chat.component.scss']
})
export class GroupChatComponent implements OnInit {

    groupChatForm: FormGroup;
    groupChatDetailsForm: FormGroup;
    showGroupChatForm = false;
    selectedGroup;
    userContacts = [];
    groupMembers = [];
    filteredContacts = [];
    memberCtrl = new FormControl();

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @Input() groups = [];
    @Input() authUser;

    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService,
        private usersService: UsersService
    ) {
        this.memberCtrl.valueChanges.subscribe(search => {
            this.filteredContacts = this.userContacts.filter(item =>
                (item.first_name + ' ' + item.last_name).toLowerCase().includes(search)
            );
        });
    }


    ngOnInit(): void {
        this.groupChatForm = this.fb.group({
            name: ['', Validators.required]
        });
        this.selectedGroup = this.groups[0];

        this.groupChatDetailsForm = this.fb.group({
            member_ids: ['', Validators.required]
        });

        this.getUserContacts();
    }

    getUserContacts() {
        this.usersService.getUserContacts({user_id: this.authUser.id, blocked: 0}).subscribe(dt => {
            this.userContacts = dt;
        });
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

    getAvatar(e) {
        console.log(e.target.files[0])
        this.selectedGroup.avatar = e.target.files[0].name;
    }

    removeMember(member) {
        const index = this.groupMembers.indexOf(member);

        if (index >= 0) {
            this.groupMembers.splice(index, 1);
            this.groupChatDetailsForm.patchValue({tags: this.groupMembers});
        }
    }

    autoCompleteMemberSelected(e) {
        const value = e.option.value;

        if (!this.groupMembers.includes(value)) {
            this.groupMembers.push(e.option.viewValue);
            this.groupChatDetailsForm.patchValue({member_ids: this.groupMembers});
        }
        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');
    }


}
