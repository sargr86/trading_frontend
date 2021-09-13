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
        console.log('OK')
        return this.httpClient.get<any>(`${API_URL}chat/get-chat-messages`, {params});
    }

    saveMessage(params) {
        return this.httpClient.post<any>(`${API_URL}chat/save-message`, params);
    }
}
