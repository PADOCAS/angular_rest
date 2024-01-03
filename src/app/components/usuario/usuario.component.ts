import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../../service/usuario.service";
import {Usuario} from "../../../model/usuario";
import {NgForOf} from "@angular/common";
import {MenuComponent} from "../menu/menu.component";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    NgForOf,
    MenuComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  nomePesquisa: string = "";

  constructor(private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    //Ao iniciar o Componente vai buscar os usuários para carregar a lista:
    this.carregarUsuariosCadastrados();
  }

  public carregarUsuariosCadastrados() {
    this.usuarioService.getListUsuarios()
      .subscribe(data => {
        this.usuarios = data
      });
  }

  public deleteUsuario(id: number) {
    this.usuarioService.deleteUsuario(id)
      .subscribe(data => {
        console.log("Retorno do método delete: " + data);
        //Após deletar, recarrega a lista de usuário para atualizar a tela!
        this.carregarUsuariosCadastrados();
      });
  }

  public consultaUsuariosPorNome() {
    if (this.nomePesquisa != null
      && this.nomePesquisa.trim() !== '') {
      //Só utiliza a pesquisa por Nome se algo for digitado em tela!
      this.usuarioService.getListUsuarioPorNome(this.nomePesquisa)
        .subscribe(data => {
          this.usuarios = data
        });
    } else {
      this.carregarUsuariosCadastrados();
    }
  }
}