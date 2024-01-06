import {Component} from '@angular/core';
import 'bootstrap';
import {Router, RouterLink} from "@angular/router";
import {StatusBarService} from "../../service/status-bar.service";

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

  constructor(private router: Router, private statusBarService: StatusBarService) {
  }

  public sair(): void {
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      localStorage.clear();
      //this.router.navigate(["login"]); //Feito direto em tela o redirecionamento

      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public menuHome(): void {
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public menuUsuarios(): void {
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      this.statusBarService.setShowStatusDialog(false);
    });
  }
}
