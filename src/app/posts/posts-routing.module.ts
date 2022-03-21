import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostFormComponent} from '@app/posts/post-form/post-form.component';


const routes: Routes = [
    {
        path: 'create',
        component: PostFormComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
