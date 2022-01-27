import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-group-avatar-handler',
    templateUrl: './group-avatar-handler.component.html',
    styleUrls: ['./group-avatar-handler.component.scss']
})
export class GroupAvatarHandlerComponent implements OnInit {
    @Input() selectedGroup;

    constructor() {
    }

    ngOnInit(): void {
    }

    changeAvatar(e) {

    }


}
