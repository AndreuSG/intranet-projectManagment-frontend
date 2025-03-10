import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'theme-selector',
  providers: [CookieService],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss'
})
export class ThemeSelectorComponent {
  isDarkMode = false;

  constructor(private cookieService: CookieService) {
    if (this.cookieService.get('dark-mode') === 'true') {
      this.toggleTheme();
    };
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.cookieService.set('dark-mode', this.isDarkMode.toString());
    setTimeout(() => document.querySelector('html')!.classList.toggle('dark-mode', this.isDarkMode), 250);
  }
}
