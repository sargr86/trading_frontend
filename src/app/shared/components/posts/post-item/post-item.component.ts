import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from '@shared/models/post';
import {PostsService} from '@core/services/posts.service';
import {UserStoreService} from '@core/services/stores/user-store.service';

@Component({
    selector: 'app-post-item',
    templateUrl: './post-item.component.html',
    styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit, AfterViewInit {
    @Input() post: Post;
    @Input() group;
    @Input() accessedFromGroup = false;
    @Output() vote = new EventEmitter();

    constructor(
        private postsService: PostsService,
        private userStore: UserStoreService
    ) {
    }

    ngOnInit(): void {
        // console.log(this.post)
    }

    voteForPost(num) {
        this.vote.emit({
            post_id: this.post.id,
            user_id: this.userStore.authUser.id,
            vote: num
        });
    }

    ngAfterViewInit() {
        // console.log(this.post)
    }

}
