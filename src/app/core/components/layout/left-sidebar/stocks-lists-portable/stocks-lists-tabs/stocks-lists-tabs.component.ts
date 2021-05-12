import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-stocks-lists-tabs',
    templateUrl: './stocks-lists-tabs.component.html',
    styleUrls: ['./stocks-lists-tabs.component.scss']
})
export class StocksListsTabsComponent implements OnInit {
    activeTab = {name: 'watchlist'};

    @Output('tabChanged') tabChanged = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }

    changeTab(tab) {
        this.activeTab.name = tab;
        this.tabChanged.emit(this.activeTab);
    }

}
