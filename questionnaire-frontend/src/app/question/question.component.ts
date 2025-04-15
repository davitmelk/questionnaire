import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from './question.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {

  public questionForm: FormGroup;
  public questionAnswer: any;
  public isQuestion = true;
  public choises = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private questionService: QuestionService
  ) {
    this.questionService.joinRoom();
    this.questionService.updateData.subscribe(data => {
      this.questionAnswer.answers = data;
    });
  }

  ngOnInit() {
    this.questionAnswer = this.activateRoute.snapshot.data.question;
    
    this.choises = this.questionAnswer.question.answers;

    let tokens = this.questionAnswer.answers.map(answers => answers.token);

    this.isQuestion = (tokens.indexOf(localStorage.getItem('token')) === -1) ? true : false;

    this.questionForm = this.formBuilder.group({
      username: [null, [
        Validators.required
      ]],
      answer: [null, [
        Validators.required
      ]],
      question_id: [this.questionAnswer.question._id,
        Validators.required
      ]
    });
  }

  ngOnDestroy() {
    this.questionService.leaveRoom();
  }

  public submitForm(event) {
    event.preventDefault();
    const controls = this.questionForm.controls;
    if (this.questionForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    this.questionService.setAnswer(this.questionForm.value).subscribe(res => {
      localStorage.setItem('token', res.token);
      this.isQuestion = false;
      this.questionService.updateDataRoom();
    });
  }

  public changeAnswer(i) {
    this.questionForm.controls['answer'].setValue(i);
  }

}
