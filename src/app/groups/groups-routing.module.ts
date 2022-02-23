import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowGroupsComponent} from '@app/groups/show-groups/show-groups.component';
import {SingleGroupComponent} from '@app/groups/single-group/single-group.component';


const routes: Routes = [
    {
        path: '',
        component: ShowGroupsComponent
    },
    {
        path: ':id',
        component: SingleGroupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupsRoutingModule {
}
