import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { ShowGroupsComponent } from './show-groups/show-groups.component';
import {SingleGroupComponent} from '@app/groups/single-group/single-group.component';
import {SharedModule} from '@shared/shared.module';
import { GroupItemComponent } from './show-groups/group-item/group-item.component';
import { AboutTabComponent } from './single-group/about-tab/about-tab.component';
import { PeopleTabComponent } from './single-group/people-tab/people-tab.component';
import { MediaTabComponent } from './single-group/media-tab/media-tab.component';
import { PostsTabComponent } from './single-group/posts-tab/posts-tab.component';


@NgModule({
  declarations: [ShowGroupsComponent, SingleGroupComponent, GroupItemComponent, AboutTabComponent, PeopleTabComponent, MediaTabComponent, PostsTabComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
      SharedModule
  ]
})
export class GroupsModule { }
