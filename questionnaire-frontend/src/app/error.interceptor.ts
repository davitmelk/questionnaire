import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertService } from './alert/alert.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private errorStatus = {
        400: 'Error in the structure of the transmitted request',
        403: 'You are not authorized to view this object.',
        404: 'The requested resource does not exist.',
        500: 'An unexpected error occurred while processing the request.'
    };

    constructor(
        private router: Router,
        private alertService: AlertService
    ) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {
            const message = this.responseErrorMessage(error) || this.errorMessage(error.status);
            
            console.log(this.router.url);
            
            if (this.router.url === '/' && (error.status === 404 || error.status === 500 || error.status === 0)) {
                error.status = error.status === 0 ? 500 : error.status;
                this.router.navigate([`/${error.status}`], { skipLocationChange: true });
            } else {
                this.alertService.show(message);
            }

            return throwError(message);
        }));
    }

    private responseErrorMessage(error) {
        if (typeof error.error !== 'object') {
            return null;
        } else if (typeof error.error.error !== 'string') {
            return null;
        } else {
            return error.error.error;
        }
    }

    private errorMessage(statusCode) {
        return (typeof this.errorStatus[statusCode] === 'undefined') ? this.errorStatus[500] : this.errorStatus[statusCode];
    }
}

