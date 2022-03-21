import {Component, OnInit} from '@angular/core';
import {PostsService} from '@core/services/posts.service';

@Component({
    selector: 'app-show-posts',
    templateUrl: './show-posts.component.html',
    styleUrls: ['./show-posts.component.scss']
})
export class ShowPostsComponent implements OnInit {
    posts = [];

    constructor(
        private postsService: PostsService
    ) {
    }

    ngOnInit(): void {
    }

    getPosts() {

    }

}
