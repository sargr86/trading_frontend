import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelsService} from '@core/services/channels.service';

@Component({
    selector: 'app-about-tab',
    templateUrl: './about-tab.component.html',
    styleUrls: ['./about-tab.component.scss']
})
export class AboutTabComponent implements OnInit {
    aboutForm: FormGroup;
    editMode = false;
    @Input('channelUser') channelUser;

    constructor(
        private fb: FormBuilder,
        private channelService: ChannelsService
    ) {
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

    saveChannelDescription() {
        console.log(this.editMode)
        this.channelService.saveDescription(this.aboutForm.value).subscribe(dt => {
            this.channelUser = dt;
            this.editMode = false;
        });
    }

}
