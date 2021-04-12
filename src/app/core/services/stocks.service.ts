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

    getStockTypes(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-types`, {params});
    }

    getIndices(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-indices`, {params});
    }

    getStocksByType(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-by-type`, {params});
    }

    getHistoricalPrices(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-historical`, {params});
    }

    getStockHistoricalPrices(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-stock-historical`, {params});
    }

    getStockChartData(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-stock-chart-data`, {params});
    }

    searchStocks(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/search`, {params});
    }

    getUserStocks(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/get-user-stocks`, {params});
    }


    updateFollowedStocks(params) {
        return this.httpClient.put<any>(`${API_URL}stocks/update-user-stocks`, params);
    }

    searchInStockTypeData(params) {
        return this.httpClient.get<any>(`${API_URL}stocks/search-in-stock-type-data`, {params});
    }
}
