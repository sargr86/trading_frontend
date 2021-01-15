import {Component, Input, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {CroppedEvent} from 'ngx-photo-editor';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChannelsService} from '@core/services/channels.service';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-channel-profile',
    templateUrl: './channel-profile.component.html',
    styleUrls: ['./channel-profile.component.scss']
})
export class ChannelProfileComponent implements OnInit {
    apiUrl = API_URL;

    profileChangedEvent: any;
    coverChangedEvent: any;
    profileBase64: any;
    coverBase64: any;

    subscribedToChannel = false;
    subscribersCount = 0;

    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    constructor(
        private usersService: UsersService,
        private base64ToFile: Base64ToFilePipe,
        private getAuthUser: GetAuthUserPipe,
        private channelService: ChannelsService,
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.checkChannelSubscription();
    }

    coverChangeEvent(event: any) {
        this.coverChangedEvent = event;

    }

    profileChangeEvent(event: any) {
        this.profileChangedEvent = event;
    }

    profileCropped(event: CroppedEvent) {
        this.profileBase64 = event.base64;
        const filename = `profile_${Date.now()}.jpg`;
        const fd = new FormData();
        fd.append('avatar_file', this.base64ToFile.transform(event.base64), filename);
        fd.append('avatar', filename);
        fd.append('id', this.authUser.id);
        this.usersService.changeProfileImage(fd).subscribe((dt) => {
            this.changeAuthUserInfo(dt);
        });
    }

    coverCropped(event: CroppedEvent) {
        this.coverBase64 = event.base64;
        const fd = new FormData();
        const filename = `cover_${Date.now()}.jpg`;
        fd.append('cover_file', this.base64ToFile.transform(event.base64), filename);
        fd.append('cover', filename);
        fd.append('id', this.authUser.id);
        this.usersService.changeCoverImage(fd).subscribe((dt) => {
            this.changeAuthUserInfo(dt);
        });
    }

    subscribeToChannel(channel): void {
        console.log(channel)
        this.channelService.subscribeToChannel({user_id: this.authUser.id, channel_id: channel.id}).subscribe(dt => {
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.subscribersCount = dt.subscribers_count;
            this.channelService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
            });
        });
    }

    checkChannelSubscription() {
        // console.log(this.channelUser)
        this.channelService.checkChannelSubscription({
            user_id: this.authUser.id,
            channel_id: this.channelUser.channel.id
        }).subscribe(dt => {
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.subscribersCount = dt.subscribers_count;
        });
    }

    changeAuthUserInfo(dt) {
        localStorage.setItem('token', dt.token);
        this.authUser = this.getAuthUser.transform();
        this.channelUser = this.authUser;
    }

}
