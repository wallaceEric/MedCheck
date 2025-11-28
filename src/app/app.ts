import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('medcheck');
}
