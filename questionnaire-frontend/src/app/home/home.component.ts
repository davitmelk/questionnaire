import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public questionForm: FormGroup;
  public answers: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      question: ['Where do we go out tonight?', [
        Validators.required
      ]],
      answers: this.formBuilder.array([
        this.createAnswer('Yes'),
        this.createAnswer('No')
      ])
    });
  }

  public createAnswer(answer?): FormGroup {
    return this.formBuilder.group({
      answer: [answer || '', Validators.required]
    });
  }

  public addAnswer(): void {
    this.answers = this.questionForm.get('answers') as FormArray;
    this.answers.push(this.createAnswer());
  }
  
  public removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }

  public submitForm(event) {
    event.preventDefault();
    const controls = this.questionForm.controls;
    if (this.questionForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    this.homeService.createQuestion(this.questionForm.value).subscribe(response => {
      this.router.navigate([`/${response._id}`]);
    });
  }

  public getFormData() {
    return <FormArray>this.questionForm.get('answers');
  }
}
