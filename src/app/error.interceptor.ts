import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from '../errors/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor { // Interceptor registered in app.module

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log(error);
        let errorMsg = 'A unknown error has occurred!';
        if (error.error.message) {
          errorMsg = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMsg}}); // Creates Mat-design alert
        return throwError(error);
      })
    );
  }
}
