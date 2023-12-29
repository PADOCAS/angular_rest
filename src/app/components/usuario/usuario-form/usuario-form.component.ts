import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../menu/menu.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    MenuComponent
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  id: number | null = null;

  constructor(private routeActive: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (this.routeActive !== null
      && this.routeActive.snapshot !== null
      && this.routeActive.snapshot.paramMap !== null
      && this.routeActive.snapshot.paramMap.get('id') !== null) {
      this.id = Number(this.routeActive.snapshot.paramMap.get('id'));

      if (this.id !== null) {
        console.log("Editando ID: " + this.id);
      }
    } else {
      console.log("Cadastrando Usuário novo");
    }
  }
}
