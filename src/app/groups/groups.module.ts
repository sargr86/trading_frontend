import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { ShowGroupsComponent } from './show-groups/show-groups.component';
import {SingleGroupComponent} from '@app/groups/single-group/single-group.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [ShowGroupsComponent, SingleGroupComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
      SharedModule
  ]
})
export class GroupsModule { }
