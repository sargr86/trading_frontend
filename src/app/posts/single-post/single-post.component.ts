import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PostsService} from '@core/services/posts.service';
import {Observable} from 'rxjs';
import {Post} from '@shared/models/post';

@Component({
    selector: 'app-single-post',
    templateUrl: './single-post.component.html',
    styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
    post$: Observable<Post>;

    constructor(
        private route: ActivatedRoute,
        private postsService: PostsService
    ) {
    }

    ngOnInit(): void {
        this.getPostById();
    }

    getPostById() {
        const postId = this.route.snapshot.params.id;
        this.post$ = this.postsService.getById({id: postId});
    }

}
