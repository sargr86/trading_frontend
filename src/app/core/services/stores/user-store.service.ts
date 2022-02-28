import {Injectable} from '@angular/core';
import jwtDecode from 'jwt-decode';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStoreService {
    token = localStorage.getItem('token');
    authUserData = this.token ? jwtDecode(this.token) : {};
    private authUserSource = new BehaviorSubject(this.authUserData);

    authUser$ = this.authUserSource.asObservable();

    constructor() {
    }

    get authUser() {
        return this.authUserSource.getValue();
    }

    setAuthUser(token) {
        let data;
        if (token) {
            data = jwtDecode(token);
            this.authUserSource.next(data);
        }
    }
}
