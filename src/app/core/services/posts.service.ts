import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';
import {Post} from '@shared/models/post';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor(
        private http: HttpClient
    ) {
    }

    get(params) {
        return this.http.get<Post[]>(`${API_URL}posts/get`, {params});
    }
}
