import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  constructor(
      private httpClient: HttpClient
  ) { }

    stripeCheckout(params) {
        return this.httpClient.post<any>(`${API_URL}purchases/stripe-checkout`, params);
    }
}
