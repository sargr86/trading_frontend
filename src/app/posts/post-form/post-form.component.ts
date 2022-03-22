import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PostsService} from '@core/services/posts.service';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';

@Component({
    selector: 'app-post-form',
    templateUrl: './post-form.component.html',
    styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
    postForm: FormGroup;
    @Input() selectedGroup;
    @Output() formReady = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        public userStore: UserStoreService,
        private groupsStore: GroupsStoreService,
        private route: ActivatedRoute,
        private router: Router,
        private postsService: PostsService
    ) {
    }

    ngOnInit(): void {
        const queryParams = this.route.snapshot.queryParams;
        console.log(queryParams.group_id)
        this.initForm(queryParams);
        this.selectedGroup = this.groupsStore.groups.find(g => g.id === +queryParams.group_id);
    }

    initForm(queryParams) {
        this.postForm = this.fb.group({
            description: ['', Validators.required],
            username: [this.userStore.authUser.username],
            author_id: [this.userStore.authUser?.id],
            group_id: [queryParams.group_id],
            votes: 1
        });
    }

    async savePost() {
        // this.formReady.emit(this.postForm.value);
        // this.postForm.reset('description');
        console.log(this.postForm.value, this.selectedGroup)
        this.postsService.add(this.postForm.value).subscribe();
        await this.router.navigateByUrl('/groups/test_1/posts');
    }

}
