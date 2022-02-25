import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-posts-tab',
  templateUrl: './posts-tab.component.html',
  styleUrls: ['./posts-tab.component.scss']
})
export class PostsTabComponent implements OnInit {

    @Input() selectedGroup;
    @Input() isOwnGroup;

    constructor() {
    }

    ngOnInit(): void {
        // console.log(this.selectedGroup)
    }

}
