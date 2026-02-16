import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Results, Area} from './results.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { thaiStrings } from 'packages/survey-core/src/localization/thai';

@Component({
  selector: 'app-result-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent implements OnInit{

  protected results!: Results;
  protected Area = Area;
  protected data: string = '';
  public key: string = '';
  public nameDesc: string = '';
  public jointAreas = [
    { label: 'Neck', key: Area.neck },
    { label: 'Upper Back', key: Area.upperBack },
    { label: 'Lower Back', key: Area.lowerBack },
    { label: 'Below Lower Back (SI)', key: Area.sacroiliac },
    { label: 'Shoulders', sides: [
      { label: 'Left', key: Area.shoulderLeft },
      { label: 'Right', key: Area.shoulderRight }
    ]},
    { label: 'Elbows', sides: [
      { label: 'Left', key: Area.elbowLeft },
      { label: 'Right', key: Area.elbowRight }
    ]},
    { label: 'Wrists', sides: [
      { label: 'Left', key: Area.wristLeft },
      { label: 'Right', key: Area.wristRight }
    ]},
    { label: 'Thumbs', sides: [
      { label: 'Left', key: Area.thumbLeft },
      { label: 'Right', key: Area.thumbRight }
    ]},
    { label: 'Fingers', sides: [
      { label: 'Left', key: Area.fingersLeft },
      { label: 'Right', key: Area.fingersRight }
    ]},
    { label: 'Hips', sides: [
      { label: 'Left', key: Area.hipLeft },
      { label: 'Right', key: Area.hipRight }
    ]},
    { label: 'Knees', sides: [
      { label: 'Left', key: Area.kneeLeft },
      { label: 'Right', key: Area.kneeRight }
    ]},
    { label: 'Ankles / Feet', sides: [
      { label: 'Left', key: Area.ankleFootLeft },
      { label: 'Right', key: Area.ankleFootRight }
    ]},
    { label: 'Big Toes', sides: [
      { label: 'Left', key: Area.bigToeLeft },
      { label: 'Right', key: Area.bigToeRight }
    ]}
  ];
  
  constructor(private router: Router) { }
  
  ngOnInit(): void {
    this.key = history.state.key ?? '';
    this.nameDesc = history.state.nameDesc ?? '';
    this.data = JSON.stringify(JSON.parse(localStorage.getItem(this.key) ?? '')?.data);
    this.results = new Results(this.data);
 }

  del(item: any) {
    localStorage.removeItem(item.key);
  }
  
  viewResults() {
    this.router.navigate([`/results`]);
  }

  GetAreaClass(state: number): string {
    if (state < 51) return 'black';
    if (state < 65) return 'purple';
    if (state < 75) return 'red';
    if (state < 85) return 'orange';
    if (state < 95) return 'yellow';
    return 'green';
  }

  public printPage(): void {
    window.print();
  }
}

