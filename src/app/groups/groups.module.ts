import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { ShowGroupsComponent } from './show-groups/show-groups.component';
import {SingleGroupComponent} from '@app/groups/single-group/single-group.component';


@NgModule({
  declarations: [ShowGroupsComponent, SingleGroupComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
