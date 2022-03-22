import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';
import {Post} from '@shared/models/post';
import {BehaviorSubject, Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {PostsStoreService} from '@core/services/stores/posts-store.service';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor(
        private http: HttpClient,
        private postsStore: PostsStoreService
    ) {
    }

    getGroupPosts(params) {
        return this.http.get<Post[]>(`${API_URL}posts/get`, {params})
    }

    getAllPosts(params) {
        return this.http.get<Post[]>(`${API_URL}posts/get`, {params})
        .pipe(shareReplay(1))
        .subscribe((posts: Post[]) => {
            this.postsStore.setAllPosts(posts);
        });
    }

    add(params) {
        return this.http.post<Post[]>(`${API_URL}posts/add`, params);
    }
}
