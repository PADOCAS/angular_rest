import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../menu/menu.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Usuario} from "../../../../model/usuario";
import {UsuarioService} from "../../../service/usuario.service";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ViaCep} from "../../../../model/viaCep";
import {StatusBarService} from "../../../service/status-bar.service";
import {ToastService} from "../../../service/toast.service";
import {Telefone} from "../../../../model/telefone";

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    MenuComponent,
    RouterLink,
    FormsModule,
    NgIf,
    NgClass,
    NgForOf
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  usuario: Usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null);

  constructor(private routeActive: ActivatedRoute, private usuarioService: UsuarioService, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.routeActive !== null
      && this.routeActive.snapshot !== null
      && this.routeActive.snapshot.params !== null
      && this.routeActive.snapshot.params['usuario'] !== undefined
      && this.routeActive.snapshot.params['usuario'] !== null) {
      //Caso estiver editando telefones e retornar para tela de Usuario:
      this.usuario = JSON.parse(this.routeActive.snapshot.params['usuario']);
    } else if (this.routeActive !== null
      && this.routeActive.snapshot !== null
      && this.routeActive.snapshot.paramMap !== null
      && this.routeActive.snapshot.paramMap.get('id') !== null) {
      //Caso estiver editando a partir da lista de Usuário (busca pelo id no banco dados atualizados)
      this.usuarioService.getUsuario(Number(this.routeActive.snapshot.paramMap.get('id')))
        .subscribe(data => {
          // console.log(data);
          this.usuario = data;
          // console.log(this.usuario);
        });
    }
  }

  public consultaCep() {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      if (this.usuario !== null
        && this.usuario.cep !== null
        && this.usuario.cep !== undefined
        && this.usuario.cep !== "") {
        if (/^\d+$/.test(this.usuario.cep)) {
          //Apenas Números:
          let viaCep: ViaCep;

          this.usuarioService.getConsultaCep(this.usuario.cep)
            .subscribe(data => {
              if (data !== null
                && ((data.erro === undefined)
                  || (data.erro === null)
                  || (data.erro === false))) {
                //Caso digite um CEP que não exista na base, porem com digitos tudo certinho ele retorna um atributo erro = true!
                //Então vamos retornar uma mensagem nesse caso avisando o usuário que o CEP não foi encontrado! (está no else)
                viaCep = data;

                if (viaCep !== null) {
                  this.usuario.logradouro = viaCep.logradouro !== null ? viaCep.logradouro.toUpperCase() : viaCep.logradouro;
                  this.usuario.bairro = viaCep.bairro !== null ? viaCep.bairro.toUpperCase() : viaCep.bairro;
                  this.usuario.localidade = viaCep.localidade !== null ? viaCep.localidade.toUpperCase() : viaCep.localidade;
                  this.usuario.complemento = viaCep.complemento !== null ? viaCep.complemento.toUpperCase() : viaCep.complemento;
                  this.usuario.uf = viaCep.uf !== null ? viaCep.uf.toUpperCase() : viaCep.uf;
                  this.toastService.showInfo(null, "Endereço carregado com sucesso!", 2000);
                } else {
                  this.limpaInfoEndereco();
                  this.toastService.showErro(null, "Erro ao consultar CEP!", null, null);
                }
              } else {
                this.limpaInfoEndereco();
                this.toastService.showErro(null, "CEP não encontrado.\nInforme um CEP válido e tente novamente.", null, null);
              }

              this.statusBarService.setShowStatusDialog(false);
            }, error => {
              this.limpaInfoEndereco();
              this.toastService.showErro("Erro ao consultar CEP", error.message + "\nInforme um CEP válido e tente novamente.", null, error.error);
              this.statusBarService.setShowStatusDialog(false);
            });
        } else {
          this.limpaInfoEndereco();
          this.toastService.showWarning(null, "CEP inválido, informe apenas números!", null);
          this.statusBarService.setShowStatusDialog(false);
        }
      } else {
        this.statusBarService.setShowStatusDialog(false);
      }
    });
  }

  private limpaInfoEndereco() {
    this.usuario.logradouro = null;
    this.usuario.bairro = null;
    this.usuario.localidade = null;
    this.usuario.complemento = null;
    this.usuario.uf = null;
  }

  public salvar(): void {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      if (this.usuario !== null) {
        if (this.usuario.id !== null
          && this.usuario.id.toString().trim() !== null) {
          //Atualizando Registro:
          this.usuarioService.editarUsuario(this.usuario)
            .subscribe(data => {
              //Limpa o cadastro para deixar pronto para salvar um novo registro se necessário:
              this.instanciaNovoRegistro();
              this.toastService.showSuccesso("Sucesso", "Usuário atualizado com sucesso!", 2000);
              this.statusBarService.setShowStatusDialog(false);
            }, error => {
              if (error.status !== null
                && error.status === 403) {
                //Erro 403 recusa do servidor (token faltando para requisição), mandamos uma mensagem genérica e encaminhamos para o login novamente:
                this.toastService.showErro("Erro ao salvar Usuário", "Usuário sem Token válido,\nRefaça o Login e tente novamente.", 2000, null);
                this.router.navigate(["login"]);
              } else {
                this.toastService.showErro("Erro ao salvar Usuário", error.message, null, error.error);
              }
              this.statusBarService.setShowStatusDialog(false);
            });
        } else {
          //Novo Registro:
          this.usuarioService.saveUsuario(this.usuario)
            .subscribe(data => {
              //Limpa o cadastro para deixar pronto para salvar um novo registro se necessário:
              this.instanciaNovoRegistro();
              this.toastService.showSuccesso("Sucesso", "Usuário salvo com sucesso!", 2000);
              this.statusBarService.setShowStatusDialog(false);
            }, error => {
              if (error.status !== null
                && error.status === 403) {
                //Erro 403 recusa do servidor (token faltando para requisição), mandamos uma mensagem genérica e encaminhamos para o login novamente:
                this.toastService.showErro("Erro ao salvar Usuário", "Usuário sem Token válido,\nRefaça o Login e tente novamente.", 2000, null);
                this.router.navigate(["login"]);
              } else {
                this.toastService.showErro("Erro ao salvar Usuário", error.message, null, error.error);
              }

              this.statusBarService.setShowStatusDialog(false);
            });
        }
      }
    });
  }

  public novo(): void {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null);
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  private instanciaNovoRegistro() {
    this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null);
  }

  public cancelar(): void {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public deleteTelefone(telefone: Telefone) {
    //Mensagem de confirmação para realizar a exclusão do registro:
    if (confirm("Confirma a exclusão do Telefone?")) {
      //StatusDialog globalizado!
      this.statusBarService.setShowStatusDialog(true);
      this.toastService.limparMensagens();

      setTimeout(() => {
        if (telefone !== null
          && this.usuario !== null
          && this.usuario.listTelefone !== null) {
          //Encontra o indice do telefone a ser deletado (busca o próprio objeto na lista e retorna o indice dele)
          let indexRemove = this.usuario.listTelefone.indexOf(telefone);
          if (indexRemove !== null
            && indexRemove !== -1) {
            //Caso encontrar remove apenas 1 registro (a partir do indice que foi encontrado acima)
            this.usuario.listTelefone.splice(indexRemove, 1);
            this.toastService.showSuccesso("Sucesso", "Telefone removido com sucesso!", 2000);
          } else {
            this.toastService.showErro("Erro ao excluir Telefone", "Telefone não encontrado.\nVerifique!", 2000, null);
          }
        } else {
          this.toastService.showErro("Erro ao excluir Telefone", "Telefone não encontrado.\nVerifique!", 2000, null);
        }

        this.statusBarService.setShowStatusDialog(false);
      });
    }
  }

  public editUsuarioTelefone(telefone: Telefone) {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      this.router.navigate(["usuario-telefone-edit", {
        telefone: JSON.stringify(telefone),
        usuario: JSON.stringify(this.usuario)
      }]);
      this.statusBarService.setShowStatusDialog(false);
    });
  }
}
