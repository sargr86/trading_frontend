import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS, PROFILE_PAGE_TABS} from '@core/constants/global';
import {User} from '@shared/models/user';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
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


    channelUser;
    passedUsername;

    searchVideosForm: FormGroup;


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

    }

    ngOnInit(): void {
        if (this.passedUsername) {
            this.usersService.getUserInfo({username: this.passedUsername}).subscribe(dt => {
                if (dt) {
                    this.channelUser = dt;
                }
            });
        }

        this.videoService.getUserVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.currentUser = dt;
        });

    }


    changeActiveTab(tab) {
        this.activeTab = tab;
        this.searchVideos();
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




}
