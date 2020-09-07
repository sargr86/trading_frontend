import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ChannelsComponent} from './channels/channels.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'channels',
    component: ChannelsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
