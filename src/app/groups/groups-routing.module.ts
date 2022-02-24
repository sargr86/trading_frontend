import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowGroupsComponent} from '@app/groups/show-groups/show-groups.component';
import {SingleGroupComponent} from '@app/groups/single-group/single-group.component';
import {PeopleTabComponent} from '@app/groups/single-group/people-tab/people-tab.component';
import {AboutTabComponent} from '@app/groups/single-group/about-tab/about-tab.component';
import {MediaTabComponent} from '@app/groups/single-group/media-tab/media-tab.component';
import {PostsTabComponent} from '@app/groups/single-group/posts-tab/posts-tab.component';


const routes: Routes = [
    {
        path: '',
        component: ShowGroupsComponent
    },
    {
        path: ':id',
        component: SingleGroupComponent,
        children: [
            {path: 'people', component: PeopleTabComponent},
            {path: 'about', component: AboutTabComponent},
            {path: 'media', component: MediaTabComponent},
            {path: 'posts', component: PostsTabComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupsRoutingModule {
}
