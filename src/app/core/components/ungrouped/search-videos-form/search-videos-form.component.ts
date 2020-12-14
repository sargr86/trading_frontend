import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-search-videos-form',
    templateUrl: './search-videos-form.component.html',
    styleUrls: ['./search-videos-form.component.scss']
})
export class SearchVideosFormComponent implements OnInit {
    searchVideosForm: FormGroup;
    @Output('search') search = new EventEmitter();

    constructor(
        private fb: FormBuilder
    ) {
        this.searchVideosForm = this.fb.group({search: ['', Validators.required]});
    }

    ngOnInit(): void {
    }

    searchVideos() {
        // this.subject.setVideosSearch(this.searchVideosForm.value);
        this.search.emit(this.searchVideosForm.value);
    }

}
