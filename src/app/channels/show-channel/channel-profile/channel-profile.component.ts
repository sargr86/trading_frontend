import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChannelsService} from '@core/services/channels.service';
import {SubjectService} from '@core/services/subject.service';
import {LoaderService} from '@core/services/loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SocketIoService} from '@core/services/socket-io.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {Router} from '@angular/router';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {UserStoreService} from '@core/services/stores/user-store.service';

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



    @Input() channelUser;
    @Input() authUser;

    constructor(
        private usersService: UsersService,
        private userStore: UserStoreService,
        private base64ToFile: Base64ToFilePipe,
        private getAuthUser: GetAuthUserPipe,
        private channelService: ChannelsService,
        private subject: SubjectService,
        private usersConnectionsStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private notificationsStore: NotificationsSubjectStoreService,
        private socketService: SocketIoService,
        public loader: LoaderService,
        private fb: FormBuilder,
    ) {


    }

    ngOnInit(): void {

        if (this.channelUser) {
            this.initChannelForm();
            this.checkChannelSubscription();
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

    checkChannelSubscription() {
        this.subscriptions.push(this.channelService.checkChannelSubscription({
            user_id: this.authUser.id,
            channel_id: this.channelUser.channel.id
        }).subscribe(dt => {
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.subscribersCount = dt.subscribers_count;
        }));
    }

    coverChangeEvent(event: any) {
        this.coverChangedEvent = event;

        const fd = new FormData();
        const filename = `cover_${Date.now()}.jpg`;
        this.channelForm.patchValue({cover: filename});
        fd.append('cover_file', event.target.files[0], filename);
        fd.append('cover', filename);
        fd.append('id', this.authUser.id);
        this.loader.dataLoading = true;
        this.subscriptions.push(this.usersService.changeCoverImage(fd).subscribe((dt) => {
            this.changeAuthUserInfo(dt);
        }));
    }

    profileChangeEvent(event: any) {
        this.profileChangedEvent = event;
        console.log(event)

        const filename = `avatar_${Date.now()}.jpg`;
        const fd = new FormData();
        fd.append('avatar_file', event.target.files[0], filename);
        fd.append('avatar', filename);
        fd.append('id', this.authUser.id);
        this.subscriptions.push(this.usersService.changeProfileImage(fd).subscribe((dt) => {
            this.changeAuthUserInfo(dt);
        }));
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

    // profileCropped(event) {
    //     // this.loader.dataLoading = true;
    //
    //     this.changingImage = true;
    //     // this.profileBase64 = event.base64;
    //     const filename = `avatar_${Date.now()}.jpg`;
    //     const fd = new FormData();
    //     this.channelForm.patchValue({avatar: filename});
    //     // fd.append('avatar_file', this.base64ToFile.transform(event.base64), filename);
    //     fd.append('avatar_file', this.base64ToFile.transform(event.base64), filename);
    //     fd.append('avatar', filename);
    //     fd.append('id', this.authUser.id);
    //     this.subscriptions.push(this.usersService.changeProfileImage(fd).subscribe((dt) => {
    //         this.changeAuthUserInfo(dt);
    //     }));
    // }

    // coverCropped(event) {
    //     this.coverBase64 = event.base64;
    //     this.changingImage = true;
    //     const fd = new FormData();
    //     const filename = `cover_${Date.now()}.jpg`;
    //     this.channelForm.patchValue({cover: filename});
    //     fd.append('cover_file', this.base64ToFile.transform(event.base64), filename);
    //     fd.append('cover', filename);
    //     fd.append('id', this.authUser.id);
    //     this.loader.dataLoading = true;
    //     this.subscriptions.push(this.usersService.changeCoverImage(fd).subscribe((dt) => {
    //         this.changeAuthUserInfo(dt);
    //     }));
    // }

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

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    saveChanges() {
        console.log('save changes!!!');
        console.log(this.channelForm.value);
        console.log('save changes!!!');

        if (this.channelForm.valid) {
            this.subscriptions.push(this.channelService.changeChannelDetails(this.channelForm.value).subscribe((dt => {
                this.editMode = false;
                this.changeAuthUserInfo(dt);
            })));
        }
    }


    changeAuthUserInfo(dt) {
        localStorage.setItem('token', dt.token);
        this.authUser = this.getAuthUser.transform();
        this.channelUser = this.authUser;
        this.changingImage = false;

        const token = dt.hasOwnProperty('token') ? dt?.token : '';
        if (token) {
            localStorage.setItem('token', token);
            this.userStore.setAuthUser(token);
        }


        // this.loader.dataLoading = false;
        // console.log(this.channelUser)
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
