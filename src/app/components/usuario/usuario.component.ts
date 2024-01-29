import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../../service/usuario.service";
import {Usuario} from "../../../model/usuario";
import {NgForOf} from "@angular/common";
import {MenuComponent} from "../menu/menu.component";
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {StatusBarService} from "../../service/status-bar.service";
import {ToastService} from "../../service/toast.service";
import {NgxPaginationModule} from "ngx-pagination";
import {catchError, of, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    NgForOf,
    MenuComponent,
    FormsModule,
    RouterLink,
    NgxPaginationModule
  ],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css', './usuario.component.responsive.css']
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  nomePesquisa: string = "";
  page: number = 0; // Inicialize com a página 0
  totalUsuariosPaginacao: number = 0;

  constructor(private usuarioService: UsuarioService, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router) {
  }

  ngOnInit(): void {
    //Ao iniciar o Componente vai buscar os usuários para carregar a lista:
    this.carregarUsuariosCadastrados();
  }

  public carregarUsuariosCadastrados() {
    //Sempre que for carregar reseta a página e totalUsuarios para bater no banco novamente e carregar os dados atualizados:
    this.page = 1; // Inicialize com a página 1
    this.totalUsuariosPaginacao = 0;

    this.usuarioService.getListUsuarios()
      .subscribe(data => {
        //Pega o Page.content (que é a lista de usuário que foi paginada)
        this.usuarios = data.content;
        this.totalUsuariosPaginacao = data.totalElements;
      });
  }

  /**
   * Método deleteUsuario com código limpo, deixando tudo esclarescido, melhor entendível e programável
   *
   * @param id (number)
   */
  public deleteUsuario(id: number): void {
    //Mensagem de confirmação para realizar a exclusão do registro:
    if (confirm("Confirma a exclusão do Usuário?")) {
      //StatusDialog globalizado!
      this.statusBarService.setShowStatusDialog(true);
      this.toastService.limparMensagens();

      //pipe: Encadear operações em observáveis.
      //switchMap: Para encadear as chamadas de API de acordo com a lógica condicional (se há um nome de pesquisa ou não)
      //catchError: Tratamos erros.
      //of: Para criar um novo observável com base nos dados recebidos.
      //tap: para executar ações secundárias (como atribuir valores às variáveis e exibir mensagens de sucesso).
      //subscribe final: Apenas para tratar exception, caso tiver.
      this.usuarioService.deleteUsuario(id).pipe(
        switchMap(() => {
          if (this.nomePesquisa
            && this.nomePesquisa.trim() !== '') {
            return this.usuarioService.getPageUsuarioPorNome(this.nomePesquisa, this.page - 1);
          } else {
            return this.usuarioService.getPageUsuarios(this.page - 1);
          }
        }), catchError(error => {
          if (error.status === 403) {
            this.toastService.showErro("Erro ao excluir Usuário", "Usuário sem Token válido,\nRefaça o Login e tente novamente.", 2000, null);
            this.router.navigate(["login"]);
          } else {
            this.toastService.showErro("Erro ao excluir Usuário", error.message, null, error.error);
          }
          throw error;
        }), switchMap(data => {
          if (data.content !== null && data.content.length === 0 && data.totalPages !== null && data.totalPages > 0 && this.page > data.totalPages) {
            this.page = data.totalPages;

            if (this.nomePesquisa
              && this.nomePesquisa.trim() !== '') {
              return this.usuarioService.getPageUsuarioPorNome(this.nomePesquisa, this.page - 1);
            } else {
              return this.usuarioService.getPageUsuarios(this.page - 1);
            }
          } else {
            return of(data);
          }
        }), tap(data => {
          this.usuarios = data.content;
          this.totalUsuariosPaginacao = data.totalElements;
          this.toastService.showSuccesso("Sucesso", "Usuário deletado com sucesso!", 2000);
          this.statusBarService.setShowStatusDialog(false);
        })
      ).subscribe(
        () => {
        },
        error => {
          if (error.status !== 403) {
            if (this.nomePesquisa
              && this.nomePesquisa.trim() !== '') {
              this.toastService.showErro("Erro ao consultar Usuário por Nome", error.message, null, error.error);
            } else {
              this.toastService.showErro("Erro ao consultar Usuário", error.message, null, error.error);
            }
          }
          this.statusBarService.setShowStatusDialog(false);
        }
      );
    }
  }

  /**
   * Método deleteUsuario sem aprimorá-lo de forma mais limpa
   * @param id (number)
   */
  public deleteUsuarioAntesSemDeixarOMetodoMaisEnxuto(id: number) {
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
            // Não vamos fazer assim, vamos deixar o nomePesquisa preenchido e apenas refazer a consulta por nome
            // this.nomePesquisa = "";
            // this.carregarUsuariosCadastrados();

            //Retira isso, vamos respeitar a página que o usuário estava e o total que trará da nova consulta após a ação de deletar!
            // this.page = 1; // Inicialize com a página 0
            // this.totalUsuariosPaginacao = 0;

            if (this.nomePesquisa !== null
              && this.nomePesquisa.trim() !== '') {
              //Só utiliza a pesquisa por Nome se algo for digitado em tela!
              this.usuarioService.getPageUsuarioPorNome(this.nomePesquisa, this.page - 1)
                .subscribe(data => {
                  //Verifica se ao deletar, a página não existe mais, ai retorna para página anterior (máxima disponível):
                  if (data.content !== null
                    && data.content.length === 0
                    && data.totalPages !== null
                    && data.totalPages > 0
                    && this.page > data.totalPages) {
                    //Joga para última página disponível:
                    this.page = data.totalPages;

                    this.usuarioService.getPageUsuarioPorNome(this.nomePesquisa, this.page - 1)
                      .subscribe(data => {
                        //Pega o Page.content (que é a lista de usuário que foi paginada)
                        this.usuarios = data.content;
                        this.totalUsuariosPaginacao = data.totalElements;

                        this.toastService.showSuccesso("Sucesso", "Usuário deletado com sucesso!", 2000);
                        this.statusBarService.setShowStatusDialog(false);
                      }, error => {
                        this.toastService.showErro("Erro ao consultar Usuário", error.message, null, error.error);
                        this.statusBarService.setShowStatusDialog(false);
                      });
                  } else {
                    this.usuarios = data.content;
                    this.totalUsuariosPaginacao = data.totalElements;

                    this.toastService.showSuccesso("Sucesso", "Usuário deletado com sucesso!", 2000);
                    this.statusBarService.setShowStatusDialog(false);
                  }
                }, error => {
                  this.toastService.showErro("Erro ao consultar Usuário por Nome", error.message, null, error.error);
                  this.statusBarService.setShowStatusDialog(false);
                });
            } else {
              //Paginação deve pegar a pagina - 1 para fazer a consulta correta la na API (começa no índice ZERO)
              this.usuarioService.getPageUsuarios(this.page - 1)
                .subscribe(data => {
                  //Pega o Page.content (que é a lista de usuário que foi paginada)
                  //Verifica se ao deletar, a página não existe mais, ai retorna para página anterior (máxima disponível):
                  if (data.content !== null
                    && data.content.length === 0
                    && data.totalPages !== null
                    && data.totalPages > 0
                    && this.page > data.totalPages) {
                    //Joga para última página disponível:
                    this.page = data.totalPages;

                    this.usuarioService.getPageUsuarios(this.page - 1)
                      .subscribe(data => {
                        //Pega o Page.content (que é a lista de usuário que foi paginada)
                        this.usuarios = data.content;
                        this.totalUsuariosPaginacao = data.totalElements;

                        this.toastService.showSuccesso("Sucesso", "Usuário deletado com sucesso!", 2000);
                        this.statusBarService.setShowStatusDialog(false);
                      }, error => {
                        this.toastService.showErro("Erro ao consultar Usuário", error.message, null, error.error);
                        this.statusBarService.setShowStatusDialog(false);
                      });
                  } else {
                    this.usuarios = data.content;
                    this.totalUsuariosPaginacao = data.totalElements;

                    this.toastService.showSuccesso("Sucesso", "Usuário deletado com sucesso!", 2000);
                    this.statusBarService.setShowStatusDialog(false);
                  }
                });
            }
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

    this.page = 1; // Inicialize com a página 1
    this.totalUsuariosPaginacao = 0;

    setTimeout(() => {
      if (this.nomePesquisa !== null
        && this.nomePesquisa.trim() !== '') {
        //Só utiliza a pesquisa por Nome se algo for digitado em tela!
        this.usuarioService.getListUsuarioPorNome(this.nomePesquisa)
          .subscribe(data => {
            //Pega o Page.content (que é a lista de usuário que foi paginada)
            this.usuarios = data.content;
            this.totalUsuariosPaginacao = data.totalElements;

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

  /**
   * Método para carregar por página, pode ser por Filtro de nome ou sem, depende o que estiver preenchido no campo pesquisa por nome!
   *
   * @param pagina (number)
   */
  public carregarPagina(pagina: number) {
    // console.log("Página: " + pagina);
    //StatusDialog globalizado!
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      if (this.nomePesquisa != null
        && this.nomePesquisa.trim() !== '') {
        //Só utiliza a pesquisa por Nome se algo for digitado em tela!
        this.usuarioService.getPageUsuarioPorNome(this.nomePesquisa, pagina - 1)
          .subscribe(data => {
            //Pega o Page.content (que é a lista de usuário que foi paginada)
            this.usuarios = data.content;
            this.totalUsuariosPaginacao = data.totalElements;

            this.statusBarService.setShowStatusDialog(false);
          }, error => {
            this.toastService.showErro("Erro ao consultar Usuário", error.message, null, error.error);
            this.statusBarService.setShowStatusDialog(false);
          });
      } else {
        //Paginação deve pegar a pagina - 1 para fazer a consulta correta la na API (começa no índice ZERO)
        this.usuarioService.getPageUsuarios(pagina - 1)
          .subscribe(data => {
            //Pega o Page.content (que é a lista de usuário que foi paginada)
            this.usuarios = data.content;
            this.totalUsuariosPaginacao = data.totalElements;

            this.statusBarService.setShowStatusDialog(false);
          });
      }
    });
  }
}
