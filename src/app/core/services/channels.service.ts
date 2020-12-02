import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ChannelsService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    get(params) {
        return this.httpClient.get<any>(`${API_URL}channels/get`, {params});
    }

    getSubscriptions(params) {
        return this.httpClient.get<any>(`${API_URL}channels/subscriptions`, {params});
    }

    searchWithVideos(params) {
        return this.httpClient.get<any>(`${API_URL}channels/search-with-videos`, {params});
    }

    subscribeToChannel(params) {
        return this.httpClient.put<any>(`${API_URL}channels/subscribe`, params);
    }

    checkChannelSubscription(params) {
        return this.httpClient.get<any>(`${API_URL}channels/check-subscription`, {params});
    }

    getUserChannelSubscriptions(params) {
        return this.httpClient.get<any>(`${API_URL}channels/get-subscriptions`, {params});
    }

    changeSubscriptionPriority(params) {
        return this.httpClient.put<any>(`${API_URL}channels/subscriptions/update-priority`, params);
    }

    saveDescription(params) {
        return this.httpClient.put<any>(`${API_URL}channels/save-description`, params);
    }


}
