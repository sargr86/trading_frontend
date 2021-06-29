import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';
import {Card} from "@shared/models/card";

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    changeProfileImage(params) {
        return this.httpClient.post<any>(`${API_URL}users/change-profile-image`, params);
    }

    changeCoverImage(params) {
        return this.httpClient.post<any>(`${API_URL}users/change-cover-image`, params);
    }

    getUserInfo(params) {
        return this.httpClient.get<any>(`${API_URL}users/get-user-info`, {params});
    }

    saveProfileChanges(params) {
        return this.httpClient.put<any>(`${API_URL}users/save-profile-changes`, params);
    }

    createStripeCard(params) {
        return this.httpClient.post(`${API_URL}users/create-stripe-user-card`, params);
    }

    getUserCards(params) {
        return this.httpClient.get(`${API_URL}users/get-customer-cards`, {params});
    }

    getCardDetails(params) {
        return this.httpClient.get<Card>(`${API_URL}users/get-card-details`, {params});
    }

    removeStripeCard(params) {
        return this.httpClient.delete<Card[]>(`${API_URL}users/remove-stripe-user-card`, {params});
    }


    updateStripeCard(params) {
        return this.httpClient.put<Card[]>(`${API_URL}users/update-stripe-user-card-info`, params);
    }

    makePrimary(params) {
        return this.httpClient.put<Card[]>(`${API_URL}users/set-customer-card-as-default`, params);
    }
}
