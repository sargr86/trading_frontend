import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ChannelsService} from "@core/services/channels.service";

@Component({
    selector: 'app-subscribers-tab',
    templateUrl: './subscribers-tab.component.html',
    styleUrls: ['./subscribers-tab.component.scss']
})
export class SubscribersTabComponent implements OnInit {
    subscriptions: Subscription[] = [];
    channelSubscribers;

    @Input() authUser;

    constructor(
        private channelsService: ChannelsService
    ) {
    }

    ngOnInit(): void {
        // console.log(this.authUser)
        this.getUserChannelSubscriptions();
    }

    getUserChannelSubscriptions() {
        this.subscriptions.push(this.channelsService.getChannelSubscriptions({id: this.authUser?.channel.id}).subscribe(dt => {
            this.channelSubscribers = dt;
        }));
    }

}
