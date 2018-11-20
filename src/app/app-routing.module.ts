import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCurrPostsComponent } from './posts/post-currPosts/post-currPosts.component';
import { PostAddComponent } from './posts/post-createBlog/post-add.component';
import { AuthGaurd } from './auth/auth.gaurd';

const routes: Routes = [
  { path: '', component: PostCurrPostsComponent },
  { path: 'newPost', component: PostAddComponent, canActivate: [AuthGaurd] },
  { path: 'edit/:postId', component: PostAddComponent, canActivate: [AuthGaurd] }, // /:postId is Dynamic segment
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ],
  providers: [ AuthGaurd ]
})
export class AppRoutingModule {}
