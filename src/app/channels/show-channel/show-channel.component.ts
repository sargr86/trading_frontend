import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS, PROFILE_PAGE_TABS} from '@core/constants/global';
import {User} from '@shared/models/user';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {CroppedEvent} from 'ngx-photo-editor';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelsService} from '@core/services/channels.service';
import {SubjectService} from '@core/services/subject.service';
import {MatDialog} from '@angular/material/dialog';
import {AddPlaylistDialogComponent} from '@core/components/modals/add-playlist-dialog/add-playlist-dialog.component';
import {PlaylistsService} from '@core/services/playlists.service';

@Component({
    selector: 'app-show-channel',
    templateUrl: './show-channel.component.html',
    styleUrls: ['./show-channel.component.scss']
})
export class ShowChannelComponent implements OnInit {

    owlOptions: OwlOptions = OWL_OPTIONS;
    currentUser: User;
    watchlistVideos = [];
    authUser;

    activeTab = PROFILE_PAGE_TABS[0];
    allTabs = PROFILE_PAGE_TABS;

    apiUrl = API_URL;

    profileChangedEvent: any;
    coverChangedEvent: any;
    profileBase64: any;
    coverBase64: any;

    channelUser;
    passedUsername;

    searchVideosForm: FormGroup;
    subscribedToChannel = false;
    subscribersCount;

    aboutForm: FormGroup;
    descriptionUpdated = false;

    playlists = [];
    editMode = false;

    constructor(
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private usersService: UsersService,
        private base64ToFile: Base64ToFilePipe,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private channelService: ChannelsService,
        private playlistsService: PlaylistsService,
        private subject: SubjectService,
        private dialog: MatDialog
    ) {
        this.authUser = this.getAuthUser.transform();
        this.passedUsername = this.route.snapshot.queryParams.username;
        this.searchVideosForm = this.fb.group({search: ['', Validators.required]});
        this.aboutForm = this.fb.group({
                description: ['', Validators.required],
                id: ['', Validators.required],
                username: ['', Validators.required]
            },
        );
    }

    ngOnInit(): void {
        if (this.passedUsername) {
            this.usersService.getUserInfo({username: this.passedUsername}).subscribe(dt => {
                if (dt) {
                    this.channelUser = dt;
                    this.aboutForm.patchValue({username: dt.username, ...dt.channel})
                    this.checkChannelSubscription();
                }
            });
        }

        this.videoService.getUserVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.currentUser = dt;
        });

        this.videoService.getVideosByAuthor({}).subscribe(dt => {
            this.watchlistVideos = dt;
        });

        this.getPlaylists();


    }

    getPlaylists() {
        this.playlistsService.get().subscribe(dt => {
            this.playlists = dt;
        });
    }

    changeActiveTab(tab) {
        this.activeTab = tab;
        this.searchVideos();
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

    openVideoPage(video, username) {
        console.log(username);
        let route;
        let params;
        if (video.status === 'live') {
            route = 'user/video/watch';
            params = {session: video.session_name, publisher: username};
        } else {
            route = 'videos/play';
            params = {id: video.id};
        }


        this.router.navigate([route], {queryParams: params});
    }

    openAddPlaylistModal() {
        this.dialog.open(AddPlaylistDialogComponent).afterClosed().subscribe(dt => {
            this.getPlaylists();
        });
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
            localStorage.setItem('token', dt.token);
            this.authUser = this.getAuthUser.transform();
            this.channelUser = this.authUser;
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
            localStorage.setItem('token', dt.token);
            this.authUser = this.getAuthUser.transform();
            this.channelUser = this.authUser;
        });
    }

    searchVideos() {

        const s = this.searchVideosForm.value;
        if (s.search) {
            if (this.activeTab.name === 'Watchlist') {
                this.searchInVideosByAuthor(s);
            } else if (this.activeTab.name === 'Videos') {
                this.searchInUserVideos(s);
            }
        }
    }

    searchInVideosByAuthor(search) {
        this.videoService.searchInVideosByAuthor(search).subscribe(dt => {
            this.watchlistVideos = dt;
        });
    }

    searchInUserVideos(search) {
        this.currentUser.videos = [];
        this.videoService.searchInUserVideos({user_id: this.authUser.id, ...search}).subscribe(dt => {
            this.currentUser.videos = dt.videos;
        });
    }

    subscribeToChannel(channel) {
        console.log(channel)
        this.channelService.subscribeToChannel({user_id: this.authUser.id, channel_id: channel.id}).subscribe(dt => {
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.subscribersCount = dt.subscribers_count;
            this.channelService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
            });
        });
    }

    saveChannelDescription() {
        console.log(this.aboutForm.value)
        this.descriptionUpdated = true;
        this.channelService.saveDescription(this.aboutForm.value).subscribe(dt => {
            this.channelUser = dt;
            this.editMode = false;
        });
    }

}
