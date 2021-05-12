import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-stocks-lists-tabs',
    templateUrl: './stocks-lists-tabs.component.html',
    styleUrls: ['./stocks-lists-tabs.component.scss']
})
export class StocksListsTabsComponent implements OnInit {
    activeTab;

    @Input('defaultTab') defaultTab;
    @Input('tabsList') tabsList;
    @Output('tabChanged') tabChanged = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
        this.activeTab = this.defaultTab;
    }

    changeTab(tab) {
        this.activeTab = tab;
        this.tabChanged.emit(tab);
    }

}
