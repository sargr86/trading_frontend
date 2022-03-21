import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostsRoutingModule} from './posts-routing.module';
import {ShowPostsComponent} from './show-posts/show-posts.component';
import {PostFormComponent} from '@app/posts/post-form/post-form.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
    declarations: [
        ShowPostsComponent,
        PostFormComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        SharedModule
    ]
})
export class PostsModule {
}
