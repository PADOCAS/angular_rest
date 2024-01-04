import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../menu/menu.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Usuario} from "../../../../model/usuario";
import {UsuarioService} from "../../../service/usuario.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    MenuComponent,
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  usuario: Usuario = new Usuario(null, null, null, null, null, null, null, null, null, null);

  constructor(private routeActive: ActivatedRoute, private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    if (this.routeActive !== null
      && this.routeActive.snapshot !== null
      && this.routeActive.snapshot.paramMap !== null
      && this.routeActive.snapshot.paramMap.get('id') !== null) {
      //Alimentando nossa variável com Usuário
      this.usuarioService.getUsuario(Number(this.routeActive.snapshot.paramMap.get('id')))
        .subscribe(data => {
          this.usuario = data;
        });
    }
  }

  public salvar(): void {

  }

  public novo(): void {
    this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null);
  }
}
