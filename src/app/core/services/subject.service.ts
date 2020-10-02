import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  public messageData = new Subject<any>();

  constructor() {
  }

  setMsgData(value) {
    this.messageData.next(value);
  }

  getMsgData(): Observable<any> {
    return this.messageData.asObservable();
  }
}
