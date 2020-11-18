import {Component, OnInit} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';
import {ChannelsService} from '@core/services/channels.service';
import {API_URL} from '@core/constants/global';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-left-sidebar',
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
    sampleList = [
        {name: 'Chillhop Music 1 ', description: 'Lorem ipsum dolor sit amet, consetetur'},
        {name: 'Chillhop Music 2 ', description: 'Lorem ipsum dolor sit amet, consetetur'},
        {name: 'Chillhop Music 3', description: 'Lorem ipsum dolor sit amet, consetetur'},
        {name: 'Chillhop Music 4 ', description: 'Lorem ipsum dolor sit amet, consetetur'},
        {name: 'Chillhop Music 5', description: 'Lorem ipsum dolor sit amet, consetetur'},
        {name: 'Chillhop Music 6', description: 'Lorem ipsum dolor sit amet, consetetur'},
        {name: 'Chillhop Music 7', description: 'Lorem ipsum dolor sit amet, consetetur'},
        {name: 'Chillhop Music 8', description: 'Lorem ipsum dolor sit amet, consetetur'},
        {name: 'Chillhop Music 9', description: 'Lorem ipsum dolor sit amet, consetetur'},
    ];
    channels = [];
    apiUrl = API_URL;
    authUser;

    constructor(
        public router: Router,
        private channelsService: ChannelsService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService
    ) {
        this.authUser = this.getAuthUser.transform();
        this.channelsService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(dt => {
            this.channels = dt;
        });
        this.subject.getUserSubscriptions().subscribe(dt => {
            this.channels = dt;
        });
    }

    ngOnInit(): void {
    }

    drop(event: CdkDragDrop<string[]>) {
        // this.channels = moveItemInArray(this.channels, event.previousIndex, event.currentIndex);

    }

    dragDropped(e, channel) {
        // console.log(e)
        // console.log(channel)
        this.channels = moveItemInArray(this.channels, e.previousIndex, e.currentIndex);
        console.log(this.channels)
        // {
        //     currentPosition: e.currentIndex + 1,
        //         channel_id: channel.id,
        //     user_id: this.authUser.id
        // }
        const sendData = {
            rows: JSON.stringify(this.channels),
            channel_id: channel.id,
            user_id: this.authUser.id
        }
        this.channelsService.changeSubscriptionPriority(sendData).subscribe(dt => {
        });
    }

}
