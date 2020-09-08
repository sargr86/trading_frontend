import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './components/layout/navbar/navbar.component';
import {LeftSidebarComponent} from './components/layout/left-sidebar/left-sidebar.component';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    NavbarComponent,
    LeftSidebarComponent
  ],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports: [
    NavbarComponent,
    LeftSidebarComponent
  ]
})
export class CoreModule {
}
