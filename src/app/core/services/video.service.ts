import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    saveVideoToken(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-token`, params);
    }

    saveRecordedData(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-data`, params);
    }

    saveVideoMessage(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-message`, params);
    }

    getUserVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-user-videos`, {params});
    }

    getVideoById(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-video-by-id`, {params});
    }
}
