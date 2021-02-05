import {Component, EventEmitter, OnInit, Output, TemplateRef} from '@angular/core';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NAVBAR_ADDITIONAL_LINKS} from '@core/constants/global';
import {environment} from '@env';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    modalRef: BsModalRef;
    authUser;
    routerUrl;

    envName = environment.envName;


    @Output('search') search = new EventEmitter();
    additionalLinks = NAVBAR_ADDITIONAL_LINKS;

    passedUsername;

    constructor(
        public router: Router,
        public auth: AuthService,
        private modalService: BsModalService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private route: ActivatedRoute
    ) {

    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();

        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
            } else if (ev instanceof ActivationEnd) {
                this.passedUsername = ev.snapshot.queryParams.username;
            }
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    logout() {
        this.auth.logout().subscribe(async () => {
            localStorage.removeItem('token');
            await this.router.navigate(['/']);
        });
    }

    searchVideos(e) {
        // this.subject.setVideosSearch(this.searchVideosForm.value);
        this.search.emit(e);
    }

    toggleMyChannelLink() {
        return !this.router.url.includes('channels/show') || this.passedUsername !== this.authUser.username;
    }

}
