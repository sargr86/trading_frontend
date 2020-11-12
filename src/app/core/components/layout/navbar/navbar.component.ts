import {Component, EventEmitter, OnInit, Output, TemplateRef} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    modalRef: BsModalRef;
    authUser;
    routerUrl;

    searchVideosForm: FormGroup;

    @Output('search') search = new EventEmitter();


    constructor(
        public router: Router,
        public auth: AuthService,
        private modalService: BsModalService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private fb: FormBuilder
    ) {
        this.searchVideosForm = this.fb.group({search: ['', Validators.required]});
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        console.log(this.authUser)
        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {

                this.routerUrl = ev.url;
                // console.log(this.routerUrl)
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

    searchVideos() {
        console.log('OK')
        // this.subject.setVideosSearch(this.searchVideosForm.value);
        this.search.emit(this.searchVideosForm.value);
    }

}
