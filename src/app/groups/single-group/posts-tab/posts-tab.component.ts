import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '@core/services/posts.service';
import {Observable, Subscription} from 'rxjs';
import {Post} from '@shared/models/post';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-posts-tab',
    templateUrl: './posts-tab.component.html',
    styleUrls: ['./posts-tab.component.scss']
})
export class PostsTabComponent implements OnInit {

    @Input() selectedGroup;
    @Input() isOwnGroup;

    posts: Observable<Post[]>;
    subscriptions: Subscription[] = [];
    trackByElement = trackByElement;

    constructor(
        private postsService: PostsService
    ) {
    }

    ngOnInit(): void {
        this.getGroupPosts();
    }

    getGroupPosts() {
        this.posts = this.postsService.get({group_id: this.selectedGroup.id});
    }

    addPost(formValue) {
        this.posts = this.postsService.add(formValue);
    }
}
