import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit{

  protected savedResults!: Array<any>;
  
  constructor( private _router: Router) {}

  ngOnInit(): void {
     
    this.savedResults = new Array<any>();
    for (var i = 0; i < localStorage.length; i++){
      let key = localStorage.key(i);
      if (key && key !="Questions_LoadState")
      {
        const val = localStorage[key];
        const dt = JSON.parse(val)?.dt;
        this.savedResults.push({key: key, dt: dt, value: val});
      }
    }
  }

  showResultDetails(item: any) {
    this._router.navigate(['/resultDetails'],{queryParams:{key:item.key}});
  }

  del(item: any, e: any) {
    // just hide the row to save a page refresh
    if(confirm("Delete '"+ item.key + "' results?")) {
      e.target.parentNode.parentNode.hidden = true;
      localStorage.removeItem(item.key);
    }
  }
}
