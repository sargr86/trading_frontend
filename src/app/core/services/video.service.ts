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

    get(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get`, {params});
    }

    saveVideoToken(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-token`, params);
    }

    saveVideoThumbnail(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-thumbnail`, params);
    }

    removeVideoThumbnail(params) {
        return this.httpClient.delete<any>(`${API_URL}videos/remove-video-thumbnail`, {params});
    }

    removeVideo(params) {
        return this.httpClient.delete<any>(`${API_URL}videos/remove`, {params});
    }

    saveRecordedData(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-data`, params);
    }

    saveVideoMessage(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-message`, params);
    }

    getVideoCategories() {
        return this.httpClient.get<any>(`${API_URL}videos/get-categories`, {});
    }

    getUserVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-user-videos`, {params});
    }

    getUserSavedVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-saved`, {params});
    }


    getVideoById(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-video-by-id`, {params});
    }

    getVideosByAuthor(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-videos-by-author`, {params});
    }

    searchInVideosByAuthor(params) {
        return this.httpClient.get<any>(`${API_URL}videos/search-in-videos-by-author`, {params});
    }

    searchInUserVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/search-in-user-videos`, {params});
    }

    searchInAllVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/search-in-all-videos`, {params});
    }

    updateLikes(params) {
        return this.httpClient.put<any>(`${API_URL}videos/update-likes`, params);
    }

    updateViews(params) {
        return this.httpClient.put<any>(`${API_URL}videos/update-views`, params);
    }

    saveVideo(params) {
        return this.httpClient.put<any>(`${API_URL}videos/save-video`, params);
    }
}
