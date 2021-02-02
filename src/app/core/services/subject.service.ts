import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    public messageData = new Subject<any>();
    public videoRecordingState = new Subject<any>();
    public videoSearchData = new Subject<any>();
    public subscriptionsData = new Subject<any>();
    public streamSessionData = new Subject<any>();
    public toggleFiltersData = new Subject<any>();

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
}
