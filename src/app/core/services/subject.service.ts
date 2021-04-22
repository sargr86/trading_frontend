import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {

    userStocks = [];
    indices = [];

    public messageData = new Subject<any>();
    public videoRecordingState = new Subject<any>();
    public videoSearchData = new Subject<any>();
    public subscriptionsData = new Subject<any>();
    public streamSessionData = new Subject<any>();
    public toggleFiltersData = new Subject<any>();
    private stocksData = new Subject<any>();
    private indicesData = new Subject<any>();
    private userStocksData = new Subject<any>();

    private userStocksSource = new BehaviorSubject(this.userStocks);
    private indicesSource = new BehaviorSubject(this.indices);

    currentUserStocks = this.userStocksSource.asObservable();
    currentIndices = this.indicesSource.asObservable();

    constructor() {
    }

    setMsgData(value) {
        this.messageData.next(value);
    }

    getMsgData(): Observable<any> {
        return this.messageData.asObservable();
    }

    setVideoRecordingState(value) {
        this.videoRecordingState.next(value);
    }

    getVideoRecordingState(): Observable<any> {
        return this.videoRecordingState.asObservable();
    }

    setVideosSearch(value) {
        this.videoSearchData.next(value);
    }

    getVideosSearch(): Observable<any> {
        return this.videoSearchData.asObservable();
    }

    setUserSubscriptions(value) {
        this.subscriptionsData.next(value);
    }

    getUserSubscriptions(): Observable<any> {
        return this.subscriptionsData.asObservable();
    }

    setSessionData(value) {
        this.streamSessionData.next(value);
    }

    getSessionData(): Observable<any> {
        return this.streamSessionData.asObservable();
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

    setIndicesData(value) {
        this.indicesData.next(value);
    }

    getIndicesData(): Observable<any> {
        return this.indicesData.asObservable();
    }

    setUserStocksData(value) {
        this.userStocksData.next(value);
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
}
