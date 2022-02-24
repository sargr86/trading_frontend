import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { ShowGroupsComponent } from './show-groups/show-groups.component';
import {SingleGroupComponent} from '@app/groups/single-group/single-group.component';
import {SharedModule} from '@shared/shared.module';
import { GroupItemComponent } from './show-groups/group-item/group-item.component';


@NgModule({
  declarations: [ShowGroupsComponent, SingleGroupComponent, GroupItemComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
      SharedModule
  ]
})
export class GroupsModule { }
