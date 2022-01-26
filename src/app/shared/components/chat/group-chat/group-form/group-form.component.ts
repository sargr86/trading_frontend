import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-group-form',
    templateUrl: './group-form.component.html',
    styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
    groupForm: FormGroup;

    @Input() authUser;
    @Output() formSubmitted = new EventEmitter();
    @Output() closeForm = new EventEmitter();

    constructor(
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.groupForm = this.fb.group({
            creator_id: [this.authUser.id],
            name: ['', Validators.required],
            username: [this.authUser.username]
        });
    }

    addGroup() {
        if (this.groupForm.valid) {
            this.formSubmitted.emit(this.groupForm.value);
            this.groupForm.patchValue({name: ''});
        }
    }

}
