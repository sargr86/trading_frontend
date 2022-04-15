import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class SubjectService {

    userStocks = {stocks: [], empty: true, initial: true};
    userCards = [];
    indices = [];
    stockTypes = [];
    stockSortTypes = [];
    videoComments = [];
    defaultExtAccount = 'bank_account';
    paymentsData = {};

    public videoRecordingState = new Subject<any>();
    public toggleFiltersData = new Subject<any>();
    private stocksData = new Subject<any>();
    private userStocksData = new Subject<any>();
    private allPaymentsData = new Subject<any>();
    private newMessageSourcesData = new Subject<any>();
    private selectedChatType = new Subject<string>();

    private userStocksSource = new BehaviorSubject(this.userStocks);
    private userCardsSource = new BehaviorSubject(this.userCards);
    private defaultExtAccountSource = new BehaviorSubject(this.defaultExtAccount);
    private videoCommentsSource = new BehaviorSubject(this.videoComments);

    private indicesSource = new BehaviorSubject(this.indices);
    private stockTypesSource = new BehaviorSubject(this.stockTypes);
    private stockSortTypesSource = new BehaviorSubject(this.stockSortTypes);
    private paymentsDataSource = new BehaviorSubject(this.paymentsData);


    currentUserStocks = this.userStocksSource.asObservable();
    currentUserCards = this.userCardsSource.asObservable();
    currentStockTypes = this.stockTypesSource.asObservable();
    currentStockSortTypes = this.stockSortTypesSource.asObservable();
    currentIndices = this.indicesSource.asObservable();
    currentVideoComments = this.videoCommentsSource.asObservable();
    currentDefaultExtAccountSource = this.defaultExtAccountSource.asObservable();
    currentPaymentsData = this.paymentsDataSource.asObservable();


    constructor() {
    }

    setVideoRecordingState(value) {
        this.videoRecordingState.next(value);
    }

    getVideoRecordingState(): Observable<any> {
        return this.videoRecordingState.asObservable();
    }

    setToggleFiltersData(value) {
        this.toggleFiltersData.next(value);
    }

    getToggleFiltersData(): Observable<any> {
        return this.toggleFiltersData.asObservable();
    }

    setStocksData(value) {
        this.stocksData.next(value);
    }

    getStocksData(): Observable<any> {
        return this.stocksData.asObservable();
    }

    setChatType(value) {
        this.selectedChatType.next(value);
    }

    getChatType(): Observable<any> {
        return this.selectedChatType.asObservable();
    }

    setUserStocksData(value) {
        this.userStocksData.next(value);
    }

    getAllPaymentsData(): Observable<any> {
        return this.allPaymentsData.asObservable();
    }

    setNewMessagesSourceData(value) {
        this.newMessageSourcesData.next(value);
    }

    getNewMessagesSourceData(): Observable<any> {
        return this.newMessageSourcesData.asObservable();
    }


    setAllPaymentsData(value) {
        this.allPaymentsData.next(value);
    }

    getUserStocksData(): Observable<any> {
        return this.userStocksData.asObservable();
    }

    changeUserStocks(stocks) {
        this.userStocksSource.next(stocks);
    }

    changeIndices(stocks) {
        this.indicesSource.next(stocks);
    }

    changeStockTypes(stocks) {
        this.stockTypesSource.next(stocks);
    }

    changeStockSortTypes(stocks) {
        this.stockSortTypesSource.next(stocks);
    }

    changeVideoComments(stocks) {
        this.videoCommentsSource.next(stocks);
    }

    changeUserCards(cards) {
        this.userCardsSource.next(cards);
    }

    changeDefaultExtAccount(acc) {
        this.defaultExtAccountSource.next(acc);
    }

    changePaymentsData(data) {
        this.paymentsDataSource.next(data);
    }
}
