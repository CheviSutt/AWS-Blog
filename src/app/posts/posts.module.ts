import { NgModule } from '@angular/core';
import { PostAddComponent } from './post-createBlog/post-add.component';
import { PostCurrPostsComponent } from './post-currPosts/post-currPosts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PostAddComponent,
    PostCurrPostsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule {}
