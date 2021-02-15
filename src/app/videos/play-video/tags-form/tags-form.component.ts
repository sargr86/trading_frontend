import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
    selector: 'app-tags-form',
    templateUrl: './tags-form.component.html',
    styleUrls: ['./tags-form.component.scss']
})
export class TagsFormComponent implements OnInit {
    @Input('tags') tags = [];
    @Output('tagsAdded') tagsAdded = new EventEmitter();
    tagsForm: FormGroup;
    isSubmitted = false;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
        private fb: FormBuilder
    ) {
        this.tagsForm = this.fb.group({
            tags: [[], Validators.required],
        });
    }

    ngOnInit(): void {
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.tags.push({name: value.trim()});
            this.tagsForm.patchValue({tags: this.tags});
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(fruit): void {
        const index = this.tags.indexOf(fruit);

        if (index >= 0) {
            this.tags.splice(index, 1);
            this.tagsForm.patchValue({tags: this.tags});
        }
    }


    saveTags() {
        this.tagsAdded.emit(this.tagsForm.value);
    }

}
