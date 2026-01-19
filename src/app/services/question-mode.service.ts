import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuestionModeService {
  private _mode = signal<'surveyjs' | 'angular'>('surveyjs');

  get mode() {
    return this._mode;
  }

  setMode(mode: 'surveyjs' | 'angular') {
    this._mode.set(mode);
  }
}
