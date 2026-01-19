import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ResultSummary {
  key: string;
  nameDesc: string;
  date: string;
  time: string;
  data: any;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  results: ResultSummary[] = [];

  constructor(private router: Router) {
    this.loadResults();
  }

  loadResults() {
    this.results = [];
    Object.keys(localStorage)
      .filter(key => key !== "medcheck-survey-state" && key.startsWith('medcheck-'))
      .forEach(key => {
        const value = localStorage.getItem(key);
        let data: any = null;
        try {
          data = JSON.parse(localStorage.getItem(key) || '');
        } catch (e) {
          console.error(`Error parsing json data for key ${key}:`, e);
        }
        if (data) {
          this.results.push({
            key,
            nameDesc: data?.data['name-desc'] ?? key.replace(/^medcheck-/, ''),
            date: data["date"],
            time: data["time"],
            data
          });
        }
      });
  }

  viewResult(result: ResultSummary) {
    this.router.navigate(['result-details'], 
      { state: { key: result.key, nameDesc: result.nameDesc } });
  }

  async deleteResult(result: ResultSummary) {
    const confirmed = await this.showConfirmDialog(`Delete result "${result.nameDesc}"?`);
    if (confirmed) {
      localStorage.removeItem(result.key);
      this.loadResults();
    }
  }

  showConfirmDialog(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.style.position = 'fixed';
      dialog.style.top = '0';
      dialog.style.left = '0';
      dialog.style.width = '100vw';
      dialog.style.height = '100vh';
      dialog.style.background = 'rgba(0,0,0,0.3)';
      dialog.style.display = 'flex';
      dialog.style.alignItems = 'center';
      dialog.style.justifyContent = 'center';
      dialog.style.zIndex = '1000';

      const box = document.createElement('div');
      box.style.background = '#fff';
      box.style.padding = '24px';
      box.style.borderRadius = '8px';
      box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      box.style.textAlign = 'center';

      const msg = document.createElement('div');
      msg.textContent = message;
      msg.style.marginBottom = '16px';

      const yesBtn = document.createElement('button');
      yesBtn.textContent = 'Yes, delete';
      yesBtn.style.marginRight = '8px';
      yesBtn.onclick = () => {
        document.body.removeChild(dialog);
        resolve(true);
      };

      const noBtn = document.createElement('button');
      noBtn.textContent = 'No';
      noBtn.onclick = () => {
        document.body.removeChild(dialog);
        resolve(false);
      };

      box.appendChild(msg);
      box.appendChild(yesBtn);
      box.appendChild(noBtn);
      dialog.appendChild(box);
      document.body.appendChild(dialog);
    });
  }
}
