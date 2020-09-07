import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './components/layout/navbar/navbar.component';
import {LeftSidebarComponent} from './components/layout/left-sidebar/left-sidebar.component';


@NgModule({
  declarations: [
    NavbarComponent,
    LeftSidebarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    LeftSidebarComponent
  ]
})
export class CoreModule {
}
