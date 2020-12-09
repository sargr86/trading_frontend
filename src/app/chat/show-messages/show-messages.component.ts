import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-show-messages',
    templateUrl: './show-messages.component.html',
    styleUrls: ['./show-messages.component.scss']
})
export class ShowMessagesComponent implements OnInit {
    activeTab = 'direct';

    constructor() {
    }

    ngOnInit(): void {
    }

    changeTab(tab) {
        this.activeTab = tab;
    }

}
