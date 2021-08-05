import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    constructor(
        private httpClient: HttpClient
    ) {
    }

    getReceivedPaymentsHistory(params) {
        return this.httpClient.get<any>(`${API_URL}stripe/payments/get-account-transfers`, {params});
    }

}
