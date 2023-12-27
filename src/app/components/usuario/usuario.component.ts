import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../../service/usuario.service";
import {Usuario} from "../../../model/usuario";
import {NgForOf} from "@angular/common";
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    NgForOf,
    MenuComponent
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    //Ao iniciar o Componente vai buscar os usuários para carregar a lista:
    this.usuarioService.getListUsuarios()
      .subscribe(data => {
        this.usuarios = data
      });
  }
}
