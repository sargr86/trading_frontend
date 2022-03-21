import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Post} from '@shared/models/post';

@Component({
    selector: 'app-post-item',
    templateUrl: './post-item.component.html',
    styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit, AfterViewInit {
    @Input() post: Post;

    constructor() {
    }

    ngOnInit(): void {
        console.log(this.post)
    }

    ngAfterViewInit() {
        console.log(this.post)
    }

}
