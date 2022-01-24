import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {CroppedEvent} from 'ngx-photo-editor';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChannelsService} from '@core/services/channels.service';
import {SubjectService} from '@core/services/subject.service';
import {LoaderService} from '@core/services/loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SocketIoService} from '@core/services/socket-io.service';

@Component({
    selector: 'app-channel-profile',
    templateUrl: './channel-profile.component.html',
    styleUrls: ['./channel-profile.component.scss']
})
export class ChannelProfileComponent implements OnInit, OnDestroy {
    apiUrl = API_URL;

    profileChangedEvent: any;
    coverChangedEvent: any;
    profileBase64: any;
    coverBase64: any;

    subscribedToChannel = false;
    subscribersCount = 0;

    changingImage = false;
    editMode = false;

    channelForm: FormGroup;
    subscriptions: Subscription[] = [];
    attemptedToConnect = false;
    usersConnection;
    isBlocked = false;
    usersConnectionStatus = 'idle';

    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    @Output() toggleChatBox = new EventEmitter();

    constructor(
        private usersService: UsersService,
        private base64ToFile: Base64ToFilePipe,
        private getAuthUser: GetAuthUserPipe,
        private channelService: ChannelsService,
        private subject: SubjectService,
        private socketService: SocketIoService,
        public loader: LoaderService,
        private fb: FormBuilder
    ) {


    }

    ngOnInit(): void {
        if (this.channelUser) {
            this.checkChannelSubscription();
            this.initChannelForm();
            // this.detectImageChange();
            this.checkIfUsersConnected();
            this.getAcceptedDeclinedRequests();
            this.getConnectWithUser();
            this.getDisconnectUser();
            this.cancelledUsersConnecting();
            this.getBlockUnblockUser();
        }
    }


    initChannelForm() {
        this.channelForm = this.fb.group({
            id: [''],
            avatar: [''],
            cover: [''],
            name: ['', Validators.required],
            username: ['']
        });

        this.channelForm.patchValue({
            name: this.channelUser.channel.name,
            id: this.channelUser.channel.id,
            username: this.channelUser.username,
            avatar: this.channelUser.channel.avatar,
            cover: this.channelUser.channel.cover
        });
    }

    checkIfUsersConnected() {
        this.usersService.checkIfUsersConnected({
            user_id: this.authUser.id,
            channel_user_id: this.channelUser.id
        }).subscribe(dt => {
            this.usersConnection = dt;
            if (dt) {
                this.isBlocked = !!dt.is_blocked;
                if (dt.confirmed) {
                    this.usersConnectionStatus = this.isBlocked ? 'blocked' : 'connected';
                } else {
                    this.usersConnectionStatus = 'pending';
                }
            }
        });
    }

    coverChangeEvent(event: any) {
        this.coverChangedEvent = event;
    }

    profileChangeEvent(event: any) {
        this.profileChangedEvent = event;
    }

    detectImageChange() {
        // document.querySelector('img.avatar').addEventListener('load', () => {
        //     console.log('Loading image!!!')
        if (this.profileChangedEvent || this.coverChangedEvent) {
            this.loader.dataLoading = false;
            this.changingImage = false;
            console.log('Avatar changed');
            console.log(this.changingImage);
        }
        // });
    }


    profileCropped(event: CroppedEvent) {
        // this.loader.dataLoading = true;

        this.changingImage = true;
        this.profileBase64 = event.base64;
        const filename = `avatar_${Date.now()}.jpg`;
        const fd = new FormData();
        this.channelForm.patchValue({avatar: filename});
        fd.append('avatar_file', this.base64ToFile.transform(event.base64), filename);
        fd.append('avatar', filename);
        fd.append('id', this.authUser.id);
        this.subscriptions.push(this.usersService.changeProfileImage(fd).subscribe((dt) => {
            this.changeAuthUserInfo(dt);
        }));
    }

    coverCropped(event: CroppedEvent) {
        this.coverBase64 = event.base64;
        this.changingImage = true;
        const fd = new FormData();
        const filename = `cover_${Date.now()}.jpg`;
        this.channelForm.patchValue({cover: filename});
        fd.append('cover_file', this.base64ToFile.transform(event.base64), filename);
        fd.append('cover', filename);
        fd.append('id', this.authUser.id);
        this.loader.dataLoading = true;
        this.subscriptions.push(this.usersService.changeCoverImage(fd).subscribe((dt) => {
            this.changeAuthUserInfo(dt);
        }));
    }

    removeCover() {
        this.channelUser.channel.cover = '';
        this.channelForm.patchValue({cover: this.channelUser.channel.cover});
    }

    removeAvatar() {
        this.channelUser.channel.avatar = '';
        this.channelForm.patchValue({avatar: this.channelUser.channel.avatar});
    }

    subscribeToChannel(channel): void {
        this.subscriptions.push(this.channelService.subscribeToChannel({
            user_id: this.authUser.id,
            channel_id: channel.id
        }).subscribe(dt => {
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.subscribersCount = dt.subscribers_count;
            this.subscriptions.push(this.channelService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
            }));
        }));
    }

    checkChannelSubscription() {
        // console.log(this.channelUser)
        this.subscriptions.push(this.channelService.checkChannelSubscription({
            user_id: this.authUser.id,
            channel_id: this.channelUser.channel.id
        }).subscribe(dt => {
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.subscribersCount = dt.subscribers_count;
        }));
    }

    changeAuthUserInfo(dt) {
        localStorage.setItem('token', dt.token);
        this.authUser = this.getAuthUser.transform();
        this.channelUser = this.authUser;
        this.changingImage = false;
        this.subject.changeAuthUser((dt.hasOwnProperty('token') ? dt.token : ''));
        // this.loader.dataLoading = false;
        // console.log(this.channelUser)
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }


    saveChanges() {
        console.log('save changes!!!')
        console.log(this.channelForm.value)
        console.log('save changes!!!')

        if (this.channelForm.valid) {
            this.subscriptions.push(this.channelService.changeChannelDetails(this.channelForm.value).subscribe((dt => {
                this.editMode = false;
                this.changeAuthUserInfo(dt);
            })));
        }
    }

    toggleBottomChatBox() {
        this.toggleChatBox.emit(this.channelUser);
    }

    connectWithUser() {
        this.attemptedToConnect = true;
        this.usersConnectionStatus = 'pending';
        this.socketService.connectWithUser({
            authUser: this.authUser,
            channelUser: this.channelUser
        });
    }

    getConnectWithUser() {
        this.socketService.getConnectWithUser().subscribe(dt => {
            console.log('get connect', dt)
            this.usersConnection = dt;

        });
    }

    cancelUsersConnecting(connection) {
        this.socketService.cancelUsersConnecting({
            authUser: this.authUser,
            channelUser: this.channelUser,
            connection_id: connection.id
        });
    }

    cancelledUsersConnecting() {
        this.socketService.cancelledUsersConnecting().subscribe(dt => {
            console.log(dt, 'cancelled')
            this.usersConnectionStatus = 'idle';
        });
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            console.log('accepted', dt)
            console.log(dt.receiver_id, this.channelUser.id)
            if ((dt.receiver_id === this.authUser.id && dt.initiator_id === this.channelUser.id)
                || (dt.receiver_id === this.channelUser.id && dt.initiator_id === this.authUser.id)) {
                this.usersConnectionStatus = 'connected';
                this.isBlocked = false;
            }
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            console.log('declined')
            this.usersConnectionStatus = 'idle';
        }));
    }


    disconnectUser() {
        console.log(this.usersConnection)
        this.socketService.disconnectUsers({
            to_username: this.channelUser.username,
            connection_id: this.usersConnection.id,
            from_id: this.usersConnection.from_id,
            to_id: this.usersConnection.to_id,
            msg: `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> has broke the connection between you two`,
        });
        this.usersConnectionStatus = 'idle';
    }

    getDisconnectUser() {
        this.subscriptions.push(this.socketService.getDisconnectUsers({}).subscribe(dt => {
            console.log('disconnected', dt)
            this.usersConnectionStatus = 'idle';
        }));
    }

    getBlockUnblockUser() {
        this.subscriptions.push(this.socketService.getBlockUnblockUser().subscribe((dt: any) => {
            console.log('get block/unblock', dt)
            this.isBlocked = true;
        }));
    }

    isMessageBtnShown() {
        return /connected|test/.test(this.usersConnectionStatus);
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
