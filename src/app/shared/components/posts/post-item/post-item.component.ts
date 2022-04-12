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

    selectedPost: Post;
    authUser;

    constructor(
        private postsService: PostsService,
        private userStore: UserStoreService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.userStore.authUser;
    }

    voteForPost(vote, post) {
        if (!this.isPostVotedByAuthUser(vote)) {
            this.selectedPost = post;
            this.vote.emit({
                post_id: this.post.id,
                user_id: this.authUser.id,
                post,
                vote
            });
        }
    }

    isPostVotedByAuthUser(vote) {
        return !!this.post?.user_posts?.find(up => {
            const usersPosts = up.users_posts;
            return usersPosts.liked === vote &&
                usersPosts.user_id === this.authUser.id;
        });
    }

    ngAfterViewInit() {
        // console.log(this.post)
    }

}
