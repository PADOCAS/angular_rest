import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../../service/usuario.service";
import {Usuario} from "../../../model/usuario";
import {NgForOf} from "@angular/common";
import {MenuComponent} from "../menu/menu.component";
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {StatusBarService} from "../../service/status-bar.service";
import {ToastService} from "../../service/toast.service";

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
  styleUrls: ['./usuario.component.css', './usuario.component.responsive.css']
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  nomePesquisa: string = "";

  constructor(private usuarioService: UsuarioService, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router) {
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
    //Mensagem de confirmação para realizar a exclusão do registro:
    if (confirm("Confirma a exclusão do Usuário?")) {
      //StatusDialog globalizado!
      this.statusBarService.setShowStatusDialog(true);
      this.toastService.limparMensagens();

      setTimeout(() => {
        this.usuarioService.deleteUsuario(id)
          .subscribe(data => {
            // console.log("Retorno do método delete: " + data);
            //Após deletar, recarrega a lista de usuário para atualizar a tela!
            this.carregarUsuariosCadastrados();
            this.toastService.showSuccesso("Sucesso", "Usuário deletado com sucesso!", 2000);
            this.statusBarService.setShowStatusDialog(false);
          }, error => {
            if (error.status !== null
              && error.status === 403) {
              //Erro 403 recusa do servidor (token faltando para requisição), mandamos uma mensagem genérica e encaminhamos para o login novamente:
              this.toastService.showErro("Erro ao excluir Usuário", "Usuário sem Token válido,\nRefaça o Login e tente novamente.", 2000, null);
              this.router.navigate(["login"]);
            } else {
              this.toastService.showErro("Erro ao excluir Usuário", error.message, null, error.error);
            }

            this.statusBarService.setShowStatusDialog(false);
          });
      });
    }
  }

  public consultaUsuariosPorNome() {
    //StatusDialog globalizado!
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      if (this.nomePesquisa != null
        && this.nomePesquisa.trim() !== '') {
        //Só utiliza a pesquisa por Nome se algo for digitado em tela!
        this.usuarioService.getListUsuarioPorNome(this.nomePesquisa)
          .subscribe(data => {
            this.usuarios = data;
            this.statusBarService.setShowStatusDialog(false);
          }, error => {
            this.toastService.showErro("Erro ao consultar Usuário", error.message, null, error.error);
            this.statusBarService.setShowStatusDialog(false);
          });
      } else {
        this.carregarUsuariosCadastrados();
        this.statusBarService.setShowStatusDialog(false);
      }
    });
  }

  public novo() {
    //StatusDialog globalizado!
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      //StatusDialog globalizado!
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public editUsuario() {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      this.statusBarService.setShowStatusDialog(false);
    });
  }
}
