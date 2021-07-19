import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getReceivedPaymentsHistory(params) {
        return this.httpClient.get<any>(`${API_URL}cards/get-account-transfers`, {params});
    }
}
