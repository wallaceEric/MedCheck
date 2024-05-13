import { formatDate } from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {Model, StylesManager} from "survey-core";
import jsonData from '../../assets/questions/questions-joint-health.json'
import { Router } from '@angular/router';

StylesManager.applyTheme("defaultV2");

@Component({ // tslint:disable-next-line:component-selector
  selector: "component-Questions",
  templateUrl: "./Questions.component.html",
  styleUrls: ["./Questions.component.scss"]
})

export class QuestionsComponent implements OnInit {
  
  constructor( private _router: Router) {}
  
  model! : Model;
  private storageName = "Questions_LoadState";
  
  ngOnInit() {
    const survey = new Model(jsonData);
    survey.onCurrentPageChanged.add(this.saveState.bind(this, survey));
    survey.completedHtml = '<h3>Thank you for your feedback</h3><a href="results"> Results </a>';
    survey.onComplete.add(this.questionsComplete.bind(this, survey));
    this.loadState(survey);
    this.model = survey;
  }


  questionsComplete (survey: Model) {
    const cookieKey = survey.data["name-desc"];
    const res = 
    {
      dt: formatDate(new Date(), 'MM-dd-yyyy hh:mm a', 'en'),
      data: survey.data
    };

    localStorage.setItem(cookieKey, JSON.stringify(res));
    this.saveState(survey)
    this._router.navigate(['/results']);
  }
 
  loadState(survey: Model) {
    var storageSt = window.localStorage.getItem(this.storageName) ?? "";
    var res: any = {};
    if (!storageSt) 
      return;

    var res = JSON.parse(storageSt);
    
      // Set the loaded data into the survey.
    if (res.currentPageNo) 
      survey.currentPageNo = res.currentPageNo;
    
    if (res.data) 
      survey.data = res.data;
    
  }

  saveState(survey: Model) {
    var res = {
      currentPageNo: survey.currentPageNo,
      data: survey.data
    };
    window.localStorage.setItem(this.storageName, JSON.stringify(res));
  }
}
