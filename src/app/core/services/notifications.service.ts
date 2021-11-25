import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "@core/constants/global";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
      private httpClient: HttpClient
  ) { }

    getAuthUserNotifications(params) {
        return this.httpClient.get(`${API_URL}notifications/get`, {params});
    }
}
