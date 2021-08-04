import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Card} from '@shared/models/card';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getUserCards(params) {
        return this.httpClient.get<Card[]>(`${API_URL}stripe/customers/get-customer-cards`, {params});
    }
}
