import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPostsStoreService {

    private userPostsSource = new BehaviorSubject([]);

    userPosts$ = this.userPostsSource.asObservable();

    constructor() {
    }

    setUserPosts(posts) {
        this.userPostsSource.next(posts);
    }
}
