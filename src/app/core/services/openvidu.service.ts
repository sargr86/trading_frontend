import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
  providedIn: 'root'
})
export class OpenviduService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getToken(params) {
    // return this.httpClient.get(`${API_URL}users/session/get-token`, {params});
    return this.httpClient.get(`${API_URL}api/tokens`, {params});
  }
}
