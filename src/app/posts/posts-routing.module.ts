import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PostFormComponent} from '@app/posts/post-form/post-form.component';
import {ShowPostsComponent} from '@app/posts/show-posts/show-posts.component';


const routes: Routes = [
    {
        path: 'create',
        component: PostFormComponent
    },
    {
        path: 'news-feed',
        component: ShowPostsComponent,
        data: {
            title: 'News feed'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule {
}
