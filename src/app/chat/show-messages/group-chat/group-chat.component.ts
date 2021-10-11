import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import IsResponsive from '@core/helpers/is-responsive';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '@core/services/chat.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {UsersService} from '@core/services/users.service';
import {ConfirmationDialogComponent} from "@core/components/modals/confirmation-dialog/confirmation-dialog.component";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

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
    inputGroupMembers = [];
    filteredContacts = [];
    memberCtrl = new FormControl();

    subscriptions: Subscription[] = [];

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @Input() groups = [];
    @Input() authUser;

    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService,
        private usersService: UsersService,
        private dialog: MatDialog
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
            group_id: [''],
            member_ids: ['', Validators.required]
        });


        this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});

        this.getUserContacts();
        this.getGroupMembers();
    }

    getUserContacts() {
        this.usersService.getUserContacts({user_id: this.authUser.id, blocked: 0}).subscribe(dt => {
            this.userContacts = dt;
        });
    }

    getGroupMembers() {
        this.chatService.getGroupMembers({group_id: this.selectedGroup.id}).subscribe(dt => {
            this.groupMembers = dt;
        });
    }


    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    makeGroupActive(group) {
        this.selectedGroup = group;
        this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});
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

    removeInputMember(member) {
        const index = this.inputGroupMembers.indexOf(member);

        if (index >= 0) {
            this.inputGroupMembers.splice(index, 1);
            this.groupChatDetailsForm.patchValue({member_ids: this.inputGroupMembers});
        }
    }

    removeSavedMember(member_id) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroupMember({group_id: this.selectedGroup.id, member_id}).subscribe(dt => {
                    this.groupMembers = dt;
                });
            }
        }));

    }


    autoCompleteMemberSelected(e) {
        const value = e.option.value;

        if (!this.inputGroupMembers.find(gm => gm.id === value)) {
            this.inputGroupMembers.push({name: e.option.viewValue, id: e.option.value});
            this.groupChatDetailsForm.patchValue({member_ids: this.inputGroupMembers.map(gm => gm.id)});
        }

        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');
    }

    addMember(e) {

        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');

        this.chatService.addGroupMembers(this.groupChatDetailsForm.value).subscribe(dt => {
            this.groupMembers = dt;
            this.inputGroupMembers = [];
        });
    }


}
