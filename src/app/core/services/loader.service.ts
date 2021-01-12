import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    formProcessing = false;
    dataLoading = false;

    constructor() {
    }
}
