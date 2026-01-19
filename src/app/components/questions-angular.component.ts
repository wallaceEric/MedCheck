import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-questions-angular',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './questions-angular.component.html',
  // styleUrls: ['./questions-angular.component.scss']
})
export class QuestionsAngularComponent implements OnInit {
  form!: FormGroup;
  surveyJson: any;
  pageIndex = 0;
  isLoaded = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('assets/questions/questions-joint-health.json').subscribe(json => {
      this.surveyJson = json;
      this.buildForm();
      this.isLoaded = true;
    });
  }

  buildForm() {
    if (!this.surveyJson) return;
    const group: any = {};
    this.surveyJson.pages.forEach((page: any) => {
      page.elements.forEach((el: any) => {
        group[el.name] = [null, el.isRequired ? Validators.required : []];
      });
    });
    this.form = this.fb.group(group);
  }

  nextPage() {
    if (this.pageIndex < this.surveyJson.pages.length - 1) {
      this.pageIndex++;
    }
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  onSubmit() {
    const result = this.form.value;
    const key = 'medcheck-' + (result['name-desc'] || 'result-' + Date.now());
    localStorage.setItem(key, JSON.stringify(result));
    // Optionally, navigate to Results or show a message
  }
}
