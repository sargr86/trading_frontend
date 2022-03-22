import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Post} from '@shared/models/post';

@Injectable({
    providedIn: 'root'
})
export class PostsStoreService {
    private allPostsSource = new BehaviorSubject([]);
    allPosts$ = this.allPostsSource.asObservable();

    private userPostsSource = new BehaviorSubject([]);
    userPosts$ = this.userPostsSource.asObservable();


    constructor() {
    }

    setPosts(posts: Post[]) {
        this.allPostsSource.next(posts);
    }
}
