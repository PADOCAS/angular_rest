import {Component} from '@angular/core';
import {AsyncPipe, NgClass} from "@angular/common";
import {StatusBarService} from "../../../service/status-bar.service";

/**
 * Componente StatusBar trabalhará em conjunto com o service para controlar o ‘show’ modal (true ou false)
 */
@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [
    NgClass,
    AsyncPipe
  ],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.css'
})
export class StatusBarComponent {
  constructor(protected statusBarService: StatusBarService) {
  }
}
