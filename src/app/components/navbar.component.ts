import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { QuestionModeService } from '../services/question-mode.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
})
export class NavbarComponent {
  constructor(private router: Router, public questionModeService: QuestionModeService) {}

  setMode(mode: 'surveyjs' | 'angular') {
    this.questionModeService.setMode(mode);
  }

  public questionMode(): string {
    return this.questionModeService.mode();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
