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
}
