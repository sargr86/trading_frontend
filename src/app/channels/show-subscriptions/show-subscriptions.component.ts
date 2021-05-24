import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelsService} from '@core/services/channels.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AuthService} from '@core/services/auth.service';
import {API_URL} from '@core/constants/global';
import {SubjectService} from '@core/services/subject.service';
import trackByElement from '@core/helpers/track-by-element';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-show-subscriptions',
    templateUrl: './show-subscriptions.component.html',
    styleUrls: ['./show-subscriptions.component.scss']
})
export class ShowSubscriptionsComponent implements OnInit, OnDestroy {
    authUser;
    userChannels;
    apiUrl = API_URL;
    trackByElement = trackByElement;
    subscriptions: Subscription[] = [];

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

    async openChannelPage(channel, username) {
        await this.router.navigate(['channels/show'], {queryParams: {username}});
    }

    getUserChannelSubscriptions() {
        this.subscriptions.push(this.channelsService.getSubscriptions({user_id: this.authUser.id}).subscribe(dt => {
            this.userChannels = dt;
        }));
    }


    checkIfSubscribed(channel) {
        return channel.channel_subscribers.subscriber_id === this.authUser?.id;
    }

    subscribeToChannel(channel) {
        this.subscriptions.push(this.channelsService.subscribeToChannel({
            user_id: this.authUser.id,
            channel_id: channel.id
        }).subscribe(dt => {
            this.subscriptions.push(this.channelsService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
                this.getUserChannelSubscriptions();
            }));
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
