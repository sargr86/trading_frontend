import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PlaylistsService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    addPlaylist(params) {
        return this.httpClient.post<any>(`${API_URL}playlists/add`, params);
    }

    addVideosToPlaylist(params) {
        return this.httpClient.post<any>(`${API_URL}playlists/add-videos`, params);
    }

    get() {
        return this.httpClient.get<any>(`${API_URL}playlists/get`, {});
    }

    getById(params) {
        return this.httpClient.get<any>(`${API_URL}playlists/get-by-id`, {params});
    }

    updatePrivacy(params) {
        return this.httpClient.put<any>(`${API_URL}playlists/update-privacy`, params);
    }

    updateVideoPosition(params) {
        return this.httpClient.put<any>(`${API_URL}playlists/update-video-position`, params);
    }

    updatePlaylistInfo(params) {
        return this.httpClient.put<any>(`${API_URL}playlists/update-playlist-info`, params);
    }

    changePlaylistThumbnail(params){
        return this.httpClient.put<any>(`${API_URL}playlists/change-thumbnail`, params);
    }

    removeVideoFromPlaylist(params) {
        return this.httpClient.delete<any>(`${API_URL}playlists/remove-video`, {params});
    }
}
