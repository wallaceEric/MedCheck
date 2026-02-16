import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SurveyModel } from 'survey-angular';
import * as Survey from 'survey-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  private surveyRendered = false;
  surveyJson: any;
  survey: SurveyModel | null = null;
  isLoaded = false;
  surveyContainerId = 'surveyContainer';
  storageName = 'medcheck-survey-state';


  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {      
    Survey.StylesManager.applyTheme('defaultV2'); 
    
    this.http.get('assets/questions/questions-joint-health.json').subscribe(json => {
      this.surveyJson = json;
      this.survey = new Survey.Model(this.surveyJson);

      // Restore previous state if available
      this.loadState(this.survey);

      // Save state on page change
      this.survey.onCurrentPageChanged.add(this.saveState.bind(this, this.survey));

      // Custom completion message and link
      this.survey.completedHtml = '<h3>Thank you for your feedback</h3><a href="results"> Results </a>';

      // Handle completion
      this.survey.onComplete.add(this.questionsComplete.bind(this, this.survey));

      Survey.SurveyNG.render(this.surveyContainerId, { model: this.survey });
    });
  }

  questionsComplete(survey: SurveyModel) {
    const cookieKey = 'medcheck-' + (survey.data['name-desc'] ?? 'result-' + Date.now());
    const dateNow = new Date();
    const res = {
      date: formatDate(dateNow, 'MM-dd-yyyy', 'en'),
      time: formatDate(dateNow, 'h:mm a', 'en'),
      data: survey.data
    };
    localStorage.setItem(cookieKey, JSON.stringify(res));
    this.saveState(survey);
    this.router.navigate(['/results']);
  }

  loadState(survey: SurveyModel) {
    const storageSt = window.localStorage.getItem(this.storageName) ?? '';
    if (!storageSt) return;
    const res = JSON.parse(storageSt);
    if (res.currentPageNo)
      survey.currentPageNo = res.currentPageNo;
    if (res.data) survey.data = res.data;
  }

  saveState(survey: SurveyModel) {
    const res = {
      currentPageNo: survey.currentPageNo,
      data: survey.data
    };
    window.localStorage.setItem(this.storageName, JSON.stringify(res));
  }
}