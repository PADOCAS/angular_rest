import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {AppModule} from "./app.module";
import {StatusBarComponent} from "./components/util/status-bar/status-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppModule, StatusBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Angular-REST';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if (localStorage != null) {
      if (localStorage.getItem("token") == null) {
        this.router.navigate(["login"]);
      }
    }
  }
}
