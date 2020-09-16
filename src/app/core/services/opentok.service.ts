import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
  providedIn: 'root'
})
export class OpentokService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  initSession() {
    return this.httpClient.get(`${API_URL}users/get-opentok-params`); //opentok
  }

  connect() {

  }
}
