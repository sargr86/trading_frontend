import {Component, OnInit} from '@angular/core';
import {ChannelsService} from '@core/services/channels.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AuthService} from '@core/services/auth.service';
import {API_URL} from '@core/constants/global';
import * as moment from 'moment';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';

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
        public router: Router,
        private subject: SubjectService
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.getUserChannelSubscriptions();
    }

    openChannelPage(channel, username) {
        this.router.navigate(['channels/show'], {queryParams: {username}});
    }

    getUserChannelSubscriptions() {
        this.channelsService.getSubscriptions({user_id: this.authUser.id}).subscribe(dt => {
            this.userChannels = dt;
        });
    }


    checkIfSubscribed(channel) {
        return channel.channel_subscribers.subscriber_id === this.authUser?.id;
    }

    subscribeToChannel(channel) {
        this.channelsService.subscribeToChannel({user_id: this.authUser.id, channel_id: channel.id}).subscribe(dt => {
            // this.subscribedToChannel = dt.status === 'Subscribed';
            this.channelsService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
                this.getUserChannelSubscriptions();
            });
        });
    }

}
