import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '@shared/models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {Subscription} from 'rxjs';
import {LowercaseRemoveSpacesPipe} from '@shared/pipes/lowercase-remove-spaces.pipe';

@Component({
    selector: 'app-create-new-group-dialog',
    templateUrl: './create-new-group-dialog.component.html',
    styleUrls: ['./create-new-group-dialog.component.scss']
})
export class CreateNewGroupDialogComponent implements OnInit {
    groupForm: FormGroup;
    subscriptions: Subscription[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public authUser: User,
        private fb: FormBuilder,
        private dialog: MatDialogRef<CreateNewGroupDialogComponent>,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private lowerCaseRemoveSpaces: LowercaseRemoveSpacesPipe
    ) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.groupForm = this.fb.group({
            name: ['', Validators.required],
            custom_name: ['', Validators.required],
            privacy: ['0'],
            creator_id: this.authUser.id,
            username: this.authUser.username
        });
    }

    submitForm() {
        this.groupForm.patchValue({custom_name: this.lowerCaseRemoveSpaces.transform(this.groupForm.value.name)});
        const formValue = this.groupForm.value;
        if (this.groupForm.valid) {
            this.subscriptions.push(this.chatService.addGroup(formValue).subscribe(async (dt) => {
                const selectedGroup = dt.find(d => formValue.name === d.name);
                this.groupsMessagesStore.setGroupsMessages(dt);
                this.groupsMessagesStore.selectGroup(selectedGroup);
                this.socketService.setNewGroup(formValue);
                this.dialog.close(this.groupForm.value);
            }));
        }
    }

    closeDialog() {
        this.dialog.close(null);
    }

}
