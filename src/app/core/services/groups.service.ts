import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class GroupsService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    confirmGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}chat/group/confirm-join-group`, params);
    }
}
