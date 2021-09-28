import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MAIN_SECTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {environment} from '@env';
import {AuthService} from '@core/services/auth.service';
import trackByElement from '@core/helpers/track-by-element';
import {SocketIoService} from '@core/services/socket-io.service';

@Component({
    selector: 'app-section-links',
    templateUrl: './section-links.component.html',
    styleUrls: ['./section-links.component.scss']
})
export class SectionLinksComponent implements OnInit {
    mainSections = MAIN_SECTIONS;
    envName;
    newMessage = false;
    trackByElement = trackByElement;

    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor(
        public router: Router,
        public auth: AuthService,
        private socketService: SocketIoService
    ) {
    }

    ngOnInit(): void {
        this.envName = environment.envName;
        this.getMessagesFromSocket();
        this.getSeen();
    }

    getMessagesFromSocket() {
        this.socketService.onNewMessage().subscribe((dt: any) => {
            console.log('new message')
            this.newMessage = true;
        });
    }

    getSeen() {
        this.socketService.getSeen().subscribe((dt: any) => {
            console.log('get seen', dt)
            this.newMessage = false;
        });
    }

    changePage(route, params = {}) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([route], {queryParams: params})
        );
    }

}
