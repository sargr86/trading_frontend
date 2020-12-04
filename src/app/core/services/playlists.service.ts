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
}
