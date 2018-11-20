import { Post } from './blog-post.model';
import { Injectable } from '@angular/core'; // getting an error
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'}) // applies service to the root, you can also import and providers=postsServices in app.module
export class PostsService {
  private posts: Post[] = [];
  private updatedPosts = new Subject<{posts: Post[], postCount: number}>(); // Listener | postsUpdated??!!

  constructor(private http: HttpClient, private router: Router) {} // private router: is used in addPost() & updatePost

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string, posts: any, maxPosts: number}>(
      BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
        return {
          posts: postData.posts.map(post => {
          return { // every element in array will be converted to object
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
          maxPosts: postData.maxPosts
        };
      })
     )
      .subscribe( reconfiguredPostData => { // reconfiguredPosts is result of map operation above
        // console.log(reconfiguredPostData);
        this.posts = reconfiguredPostData.posts; // Setting posts variable to posts from server
        this.updatedPosts.next({
          posts: [...this.posts],
          postCount: reconfiguredPostData.maxPosts
        });
      });
   // [...this.posts]; // spread operator before backend added
  }

  getUpdatedPostsListener() {
    return this.updatedPosts.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL + id); // pulling from post-add.component
    // return {...this.posts.find(p => p.id === id)}; // ... is a Spread operator | used in post-add.component
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // title after image could be named anything
    this.http
      .post<{ message: string, post: Post }>(
        BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, postData) // http.put = put method from app.js - app.put(/posts/:id)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId); // subscribed in post-currPosts
  }

}
