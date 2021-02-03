import {Component, Input, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {AddPlaylistDialogComponent} from '@core/components/modals/add-playlist-dialog/add-playlist-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-playlists-tab',
    templateUrl: './playlists-tab.component.html',
    styleUrls: ['./playlists-tab.component.scss']
})
export class PlaylistsTabComponent implements OnInit {
    playlists = [];
    apiUrl = API_URL;
    showFilters = false;

    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    constructor(
        public router: Router,
        private playlistsService: PlaylistsService,
        private subjectService: SubjectService,
        private dialog: MatDialog
    ) {

    }


    ngOnInit(): void {
        const s = localStorage.getItem('search');
        console.log(!s)
        if (!s) {
            this.getPlaylists();
        } else {
            this.getSearchResults(s);
        }

        this.subjectService.getToggleFiltersData().subscribe(dt => {
            this.showFilters = dt;
        });
    }


    getPlaylists() {
        this.playlistsService.get({channel_id: this.channelUser.channel.id}).subscribe(dt => {
            this.playlists = dt;
        });
    }

    openAddPlaylistModal() {
        this.dialog.open(AddPlaylistDialogComponent, {data: {channel_id: this.channelUser.channel.id}}).afterClosed().subscribe(dt => {
            this.getPlaylists();
        });
    }

    openPlaylistPage(playlist, firstVideoId) {
        const route = 'videos/play';
        const params = {id: firstVideoId, playlist_id: playlist.id};
        this.router.navigate([route], {queryParams: params});
    }

    getSearchResults(s) {
        console.log(s)
        this.playlistsService.searchPlaylists({search: s}).subscribe(dt => {
            this.playlists = dt;
        });
    }

    getFilteredPlaylists(e) {
        this.playlistsService.get({
            channel_id: this.channelUser.channel.id,
            filters: JSON.stringify(e)
        }).subscribe(dt => {
            this.playlists = dt;
        });
    }

    goToEditPage(playlist) {
        this.router.navigate(['playlists/single/' + playlist.id]);
    }

    removePlaylist(id, channelId) {
        this.playlistsService.removePlaylist({id, channel_id: channelId}).subscribe(dt => {
            this.playlists = dt;
        });
    }

}
