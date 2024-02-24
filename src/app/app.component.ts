import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {AppModule} from "./app.module";
import {StatusBarComponent} from "./components/util/status-bar/status-bar.component";
import {ToastComponent} from "./components/util/toast/toast.component";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppModule, StatusBarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Angular-REST';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Verificar se a rota atual é 'recuperar-senha', caso for deixa passar sem Redirecionar (não precisa de token):
      if (this.activatedRoute !== null
        && this.activatedRoute.snapshot !== null
        && this.activatedRoute.snapshot.firstChild !== null
        && this.activatedRoute.snapshot.firstChild.routeConfig !== null
        && this.activatedRoute.snapshot.firstChild.routeConfig.path !== null
        && this.activatedRoute.snapshot.firstChild.routeConfig.path === 'recuperar-senha') {
        return; // Se a rota for 'recuperar-senha', não faça nada (Não precisa do Token)
      }

      if (localStorage != null) {
        if (localStorage.getItem("token") == null) {
          this.router.navigate(["login"]);
        }
      }
    });
  }
}
