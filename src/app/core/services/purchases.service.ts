import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class PurchasesService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getStripeProducts() {
        return this.httpClient.get<any>(`${API_URL}products/get-stripe-products`);
    }

    stripeCheckout(params) {
        return this.httpClient.post<any>(`${API_URL}purchases/stripe-checkout`, params);
    }

    createPaymentIntent(params) {
        return this.httpClient.post<any>(`${API_URL}purchases/create-payment-intent`, params);
    }

    stripeCharge(params) {
        return this.httpClient.post<any>(`${API_URL}purchases/stripe-charge`, params);
    }

    getAllPaymentsHistory(params) {
        return this.httpClient.get<any>(`${API_URL}purchases/get-all-payments-history`, {params});
    }

    getPurchasesHistory(params) {
        return this.httpClient.get<any>(`${API_URL}purchases/get-purchases-history`, {params});
    }
}
