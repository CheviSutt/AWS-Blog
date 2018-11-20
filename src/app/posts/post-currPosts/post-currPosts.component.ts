import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../blog-post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-currPosts',
  templateUrl: './post-currPosts.component.html',
  styleUrls: ['./post-currPosts.component.css']
})

export class PostCurrPostsComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'Test Post-1', content: '1: Here are some words to fill in text'},
  //   {title: 'Test Post-2', content: '2: Here are some words to fill in text'},
  //   {title: 'Test Post-3', content: '3: are some words to fill in text'}
  //   ];
  posts: Post[] = [];
  loadingSpinner = false;
  totalPosts = 0;
  postsPerPage = 3;
  postsAmountSelect = [1, 2, 5, 10];
  currentPage = 1;
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {} // Looking for an instance of PostsService type,
  // Keyword: public, stores value of property in component^^

  ngOnInit() {
    this.loadingSpinner = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
   // this.posts = this.postsService.getPosts(); // Retrieves all the posts before backend
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getUpdatedPostsListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        // Post[], postCount defined in posts.service - updatedPosts ^^
        this.loadingSpinner = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth(); // called from authService
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this.loadingSpinner = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize; // selected by user
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  postDelete(postID: string) {
    this.loadingSpinner = true;
    this.postsService.deletePost(postID).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.loadingSpinner = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe(); // Prevents memory leak
    this.authStatusSub.unsubscribe();
  }
}
