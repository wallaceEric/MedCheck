import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';
import { ResultsComponent } from './results/results.component';
import { ResultDetailsComponent } from './results/result-details/result-details.component';
import { HomeComponent } from './home/home/home.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "questions", component: QuestionsComponent},
  {path: "results", component: ResultsComponent},
  {path: "resultDetails", component: ResultDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
