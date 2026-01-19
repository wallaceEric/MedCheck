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
    { label: 'Neck', key: Area.Neck },
    { label: 'Upper Back', key: Area.BackUpper },
    { label: 'Lower Back', key: Area.BackLower },
    { label: 'Below Lower Back (SI)', key: Area.SI },
    { label: 'Shoulders', sides: [
      { label: 'Left', key: Area.Shoulder_Left },
      { label: 'Right', key: Area.Shoulder_Right }
    ]},
    { label: 'Elbows', sides: [
      { label: 'Left', key: Area.Elbow_Left },
      { label: 'Right', key: Area.Elbow_Right }
    ]},
    { label: 'Wrists', sides: [
      { label: 'Left', key: Area.Wrist_Left },
      { label: 'Right', key: Area.Wrist_Right }
    ]},
    { label: 'Thumbs', sides: [
      { label: 'Left', key: Area.Thumb_Left },
      { label: 'Right', key: Area.Thumb_Right }
    ]},
    { label: 'Fingers', sides: [
      { label: 'Left', key: Area.Fingers_Left },
      { label: 'Right', key: Area.Fingers_Right }
    ]},
    { label: 'Hips', sides: [
      { label: 'Left', key: Area.Hip_Left },
      { label: 'Right', key: Area.Hip_Right }
    ]},
    { label: 'Knees', sides: [
      { label: 'Left', key: Area.Knee_Left },
      { label: 'Right', key: Area.Knee_Right }
    ]},
    { label: 'Ankles / Feet', sides: [
      { label: 'Left', key: Area.AnkleFoot_Left },
      { label: 'Right', key: Area.AnkleFoot_Right }
    ]},
    { label: 'Big Toes', sides: [
      { label: 'Left', key: Area.BigToe_Left },
      { label: 'Right', key: Area.BigToe_Right }
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

