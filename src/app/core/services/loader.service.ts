import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    formProcessing = false;
    dataLoading = false;
    isLoading = new Subject<boolean>();

    private loaderSource = new BehaviorSubject(false);
    currentLoaderState = this.loaderSource.asObservable();

    constructor() {
    }

    show() {

        this.loaderSource.next(true);
    }

    hide() {

        this.loaderSource.next(false);
    }

}
