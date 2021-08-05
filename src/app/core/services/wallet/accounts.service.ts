import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {

    constructor(
        private httpClient: HttpClient
    ) {
    }


    addStripeBankAccount(params) {
        return this.httpClient.post<any>(`${API_URL}stripe/accounts/create-stripe-bank-account`, params);
    }

    getBankAccount(params) {
        console.log('OK')
        return this.httpClient.get<any>(`${API_URL}stripe/accounts/get-stripe-account`, {params});
    }

}
