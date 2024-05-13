import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Results, Area} from '../results.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent implements OnInit{

  protected results!: Results;
  protected Area = Area;
  protected data: string = '';
  protected key!: string;
  
  constructor(private activatedRoute:ActivatedRoute) {

    this.activatedRoute.queryParamMap.subscribe ({
      next: (params: ParamMap) => {
        this.key = params.get('key') ?? '';
        this.data = JSON.stringify(JSON.parse(localStorage.getItem(this.key) ?? '')?.data);
      },
      error: (error: any) => {
        console.log(error);
      }
    });

  }
  
  ngOnInit(): void {
    this.results = new Results(this.data);
 }

  del(item: any) {
    localStorage.removeItem(item.key);
  }

  GetAreaClass(state: number): string {
    if (state < 51) return 'black';
    if (state < 65) return 'purple';
    if (state < 75) return 'red';
    if (state < 85) return 'orange';
    if (state < 95) return 'yellow';
    return 'green';
  }
}

