import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-group-item',
    templateUrl: './group-item.component.html',
    styleUrls: ['./group-item.component.scss']
})
export class GroupItemComponent implements OnInit {
    @Input() group;

    constructor() {
    }

    ngOnInit(): void {
    }

}
