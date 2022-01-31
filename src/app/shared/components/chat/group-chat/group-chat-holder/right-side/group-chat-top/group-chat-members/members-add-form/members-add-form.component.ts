import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';


@Component({
    selector: 'app-members-add-form',
    templateUrl: './members-add-form.component.html',
    styleUrls: ['./members-add-form.component.scss']
})
export class MembersAddFormComponent implements OnInit {
    inputGroupMembers = [];
    filteredContacts = [];

    subscriptions: Subscription[] = [];

    memberCtrl = new FormControl();
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @Input() selectedGroup;
    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;

    groupChatDetailsForm: FormGroup;

    constructor(
        private dialog: MatDialog,
        private chatService: ChatService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.groupChatDetailsForm = this.fb.group({
            group_id: [''],
            member_ids: ['', Validators.required]
        });
    }

    autoCompleteMemberSelected(e) {
        const value = e.option.value;

        if (!this.inputGroupMembers.find(gm => gm.id === value)) {
            this.inputGroupMembers.push(e.option.value);
            this.groupChatDetailsForm.patchValue({member_ids: this.inputGroupMembers});
        }

        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');
    }

    addMember(e) {

        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');

        // console.log(this.groupChatDetailsForm.value, this.selectedGroup)

        this.subscriptions.push(this.chatService.addGroupMembers(
            this.groupChatDetailsForm.value
        ).subscribe(dt => {
            // this.groupMembers = dt?.chat_group_members;
            // this.socketService.inviteToNewGroup({members: this.inputGroupMembers, group_id: this.selectedGroup.id});
            this.inputGroupMembers = [];
        }));
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
                    // this.groupMembers = dt?.chat_group_members;
                });
            }
        }));
    }

}
