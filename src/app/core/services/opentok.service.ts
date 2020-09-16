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

  initSession(room) {
    console.log(room)
    return this.httpClient.get(`${API_URL}users/session/${room}`); //opentok
  }

  connect() {

  }
}
