import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit, OnDestroy {
  loadingSpinner = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
     this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
       authStatus => {
         this.loadingSpinner = false;
       }
     );
  }

  onSignUp(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.loadingSpinner = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
