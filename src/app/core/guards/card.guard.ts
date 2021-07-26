import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {User} from '@shared/models/user';
import {ToastrService} from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class CardGuard implements CanActivate {
    userCards = [];

    constructor(
        private subject: SubjectService,
        private toastr: ToastrService
    ) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
        });

        const userHasCards = this.userCards.length > 0;

        if (!userHasCards) {
            this.toastr.error('You are not permitted to access that page', 'No cards');
        }

        return userHasCards;
    }

}
