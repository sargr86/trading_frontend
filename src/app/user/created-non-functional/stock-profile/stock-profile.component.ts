import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-stock-profile',
    templateUrl: './stock-profile.component.html',
    styleUrls: ['./stock-profile.component.scss']
})
export class StockProfileComponent implements OnInit {
    activeTab = 'home';

    constructor() {
    }

    ngOnInit(): void {
    }

    changeTab(tab) {
        this.activeTab = tab;
    }

}
