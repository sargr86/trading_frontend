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

    addGroup(params) {
        return this.httpClient.post<any>(`${API_URL}groups/create-group`, params);
    }

    getGroupMembers(params) {
        return this.httpClient.get<any>(`${API_URL}groups/get-group-members`, {params});
    }

    addGroupMembers(params) {
        return this.httpClient.post<any>(`${API_URL}groups/add-group-members`, params);
    }

    removeGroupMember(params) {
        return this.httpClient.delete<any>(`${API_URL}groups/remove-group-member`, {params});
    }

    removeGroup(params) {
        return this.httpClient.delete<any>(`${API_URL}groups/remove-group`, {params});
    }

    leaveGroup(params) {
        return this.httpClient.delete<any>(`${API_URL}groups/leave-group`, {params});
    }

    acceptGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/accept-join-group`, params);
    }

    declineGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/decline-join-group`, params);
    }

    joinGroup(params) {
        return this.httpClient.post<any>(`${API_URL}groups/join-group`, params);
    }

    confirmGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/confirm-join-group`, params);
    }

    ignoreGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/ignore-join-group`, params);
    }

    getGroupByCustomName(params) {
        return this.httpClient.get<any>(`${API_URL}groups/get-group-by-name`, {params});
    }
}
