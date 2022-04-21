import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChannelsService} from '@core/services/channels.service';

@Component({
    selector: 'app-subscribers-tab',
    templateUrl: './subscribers-tab.component.html',
    styleUrls: ['./subscribers-tab.component.scss']
})
export class SubscribersTabComponent implements OnInit {
    subscriptions: Subscription[] = [];
    channelSubscribers;

    @Input() authUser;
    @Input() channelUser;

    constructor(
        private channelsService: ChannelsService
    ) {
    }

    ngOnInit(): void {
        this.getUserChannelSubscriptions();
    }

    getUserChannelSubscriptions() {
        this.subscriptions.push(this.channelsService.getChannelSubscriptions({id: this.channelUser.id}).subscribe(dt => {
            this.channelSubscribers = dt;
        }));
    }

}
