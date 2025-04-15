import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { QuestionService } from './question.service';

@Injectable()
export class QuestionResolver implements Resolve<any> {
    constructor(
        private questionService: QuestionService
    ) { }

    resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<any> {
        return this.questionService.getQuestion(activatedRouteSnapshot.params.id);
    }
}