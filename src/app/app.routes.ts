import { Routes } from '@angular/router';

import { HomeComponent } from './components/home.component';
import { QuestionsComponent } from './components/questions.component';
import { ResultsComponent } from './components/results.component';
import { ResultDetailsComponent } from './components/result-details/result-details.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'questions', component: QuestionsComponent },
	{ path: 'results', component: ResultsComponent },
	{ path: 'result-details', component: ResultDetailsComponent }
];
