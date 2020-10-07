import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  public messageData = new Subject<any>();
  public videoRecordingState = new Subject<any>();

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
}
