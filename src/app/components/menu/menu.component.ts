import {Component} from '@angular/core';
import '@popperjs/core';
import 'bootstrap';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private router: Router) {
  }

  public sair(): void {
    localStorage.clear();
    this.router.navigate(["login"]);
  }
}
