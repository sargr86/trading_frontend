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
    return this.httpClient.post<any>(`${API_URL}video/save-video-token`, params);
  }

  saveRecordedData(params) {
    return this.httpClient.post<any>(`${API_URL}video/save-video-data`, params);
  }

  saveVideoMessage(params) {
    return this.httpClient.post<any>(`${API_URL}video/save-video-message`, params);
  }
}
