import {Component, OnInit} from '@angular/core';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {GetAuthUserPipe} from "@shared/pipes/get-auth-user.pipe";
import {SocketIoService} from "@core/services/socket-io.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    owlOptions = OWL_OPTIONS;
    videos = [];
    apiUrl = API_URL;
    authUser;

    constructor(
        private videoService: VideoService,
        public router: Router,
        public auth: AuthService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService
    ) {
    }

    ngOnInit(): void {
        this.videoService.get({}).subscribe(dt => {
            this.videos = dt.videos;
        });
        this.authUser = this.getAuthUser.transform();
        if (this.authUser) {
            this.socketService.addNewUser(this.authUser);
        }
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

}
