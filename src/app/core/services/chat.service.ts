import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getChatMessages(params) {
        return this.httpClient.get<any>(`${API_URL}chat/get-messages`, {params});
    }

    getGeneralChatMessages(params) {
        return this.httpClient.get<any>(`${API_URL}chat/get-chat-messages`, {params});
    }

    saveMessage(params) {
        return this.httpClient.post<any>(`${API_URL}chat/save-message`, params);
    }

    getChatGroups(params){
        return this.httpClient.get<any>(`${API_URL}chat/get-chat-groups`, {params});
    }

    addGroup(params) {
        return this.httpClient.post<any>(`${API_URL}chat/create-group`, params);
    }

    getGroupMembers(params){
        return this.httpClient.get<any>(`${API_URL}chat/get-group-members`, {params});
    }

    addGroupMembers(params) {
        return this.httpClient.post<any>(`${API_URL}chat/add-group-members`, params);
    }

    removeGroupMember(params) {
        return this.httpClient.delete<any>(`${API_URL}chat/remove-group-member`, {params});
    }

    removeGroup(params) {
        return this.httpClient.delete<any>(`${API_URL}chat/remove-group`, {params});
    }

}
