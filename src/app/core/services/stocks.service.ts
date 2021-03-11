import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class StocksService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getDailyStocks(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-daily`, {params});
    }

    getIndices(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-indices`, {params});
    }
}
