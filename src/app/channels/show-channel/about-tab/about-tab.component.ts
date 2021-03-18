import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelsService} from '@core/services/channels.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-about-tab',
    templateUrl: './about-tab.component.html',
    styleUrls: ['./about-tab.component.scss']
})
export class AboutTabComponent implements OnInit, AfterViewInit {
    aboutForm: FormGroup;
    editMode = false;
    authUser;
    @Input('channelUser') channelUser;

    constructor(
        private fb: FormBuilder,
        private channelService: ChannelsService,
        private getAuthUser: GetAuthUserPipe
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.aboutForm = this.fb.group({
                description: ['', Validators.required],
                id: ['', Validators.required],
                username: ['', Validators.required]
            },
        );
        this.aboutForm.patchValue({username: this.channelUser.username, ...this.channelUser.channel});

    }

    editModeOn() {
        this.editMode = true;
    }

    getDesc(d) {
        return d.replace('<br>', '\\n');
    }

    saveChannelDescription() {
        console.log(this.editMode)
        this.channelService.saveDescription(this.aboutForm.value).subscribe(dt => {
            this.channelUser = dt;
            this.editMode = false;
        });
    }

    ngAfterViewInit() {
        document.querySelector('.description').innerHTML = this.channelUser.channel.description;
    }

}
