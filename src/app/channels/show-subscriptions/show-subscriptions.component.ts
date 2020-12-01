import {Component, OnInit} from '@angular/core';
import {ChannelsService} from '@core/services/channels.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AuthService} from '@core/services/auth.service';
import {API_URL} from '@core/constants/global';
import * as moment from 'moment';

@Component({
    selector: 'app-show-subscriptions',
    templateUrl: './show-subscriptions.component.html',
    styleUrls: ['./show-subscriptions.component.scss']
})
export class ShowSubscriptionsComponent implements OnInit {
    authUser;
    userChannels;
    apiUrl = API_URL;

    constructor(
        private channelsService: ChannelsService,
        private getAuthUser: GetAuthUserPipe,
        public auth: AuthService,
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.channelsService.getSubscriptions({user_id: this.authUser.id}).subscribe(dt => {
            this.userChannels = dt;
        });
    }

    getUploadDateTime(datetime) {
        return moment(datetime).format('MMM DD, YYYY');
    }

}
