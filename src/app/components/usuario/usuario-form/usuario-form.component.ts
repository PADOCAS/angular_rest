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
import {UsuarioTelefoneService} from "../../../service/usuario-telefone.service";

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
  styleUrls: ['./usuario-form.component.css', './usuario-form.component.responsive.css']
})
export class UsuarioFormComponent implements OnInit {
  usuario: Usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, new Array<Telefone>, null);
  mostrarSenha = false;

  constructor(private routeActive: ActivatedRoute, private usuarioService: UsuarioService, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router, private usuarioTelefoneService: UsuarioTelefoneService) {
  }

  ngOnInit(): void {
    if (localStorage !== undefined
      && localStorage !== null
      && localStorage.getItem("token") !== undefined
      && localStorage.getItem("token") !== null
      && this.usuarioTelefoneService.getListUsuario() !== undefined
      && this.usuarioTelefoneService.getListUsuario() !== null
      && this.usuarioTelefoneService.getListUsuario().get(localStorage.getItem("token")) !== undefined
      && this.usuarioTelefoneService.getListUsuario().get(localStorage.getItem("token")) !== null) {
      //Caso estiver editando telefones e retornar para tela de Usuario:
      this.usuario = this.usuarioTelefoneService.getListUsuario().get(localStorage.getItem("token")) as Usuario;
      //Limpa referência para não atrapalhar outras vezes que entrar no cadastro!
      this.usuarioTelefoneService.getListUsuario().set(localStorage.getItem("token"), null);
    } else if (this.routeActive !== undefined
      && this.routeActive !== null
      && this.routeActive.snapshot !== undefined
      && this.routeActive.snapshot !== null
      && this.routeActive.snapshot.paramMap !== undefined
      && this.routeActive.snapshot.paramMap !== null
      && this.routeActive.snapshot.paramMap.get('id') !== undefined
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

    if (this.validarSalvar()) {
      setTimeout(() => {
        if (this.usuario !== null) {
          if (this.usuario.id !== null
            && this.usuario.id.toString().trim() !== null) {
            //Atualizando Registro:
            this.usuarioService.editarUsuario(this.usuario)
              .subscribe(data => {
                //Limpa o cadastro para deixar pronto para salvar um novo registro se necessário:
                // this.instanciaNovoRegistro();
                this.toastService.showSuccesso("Sucesso", "Usuário atualizado com sucesso!", 2000);
                this.router.navigate(["usuarioList"]);
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
                // this.instanciaNovoRegistro();
                this.toastService.showSuccesso("Sucesso", "Usuário salvo com sucesso!", 2000);
                this.router.navigate(["usuarioList"]);
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
    } else {
      this.statusBarService.setShowStatusDialog(false);
    }
  }

  public novo(): void {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, new Array<Telefone>, null);
      if (localStorage !== undefined
        && localStorage !== null
        && localStorage.getItem("token") !== undefined
        && localStorage.getItem("token") !== null
        && this.usuarioTelefoneService.getListUsuario() !== undefined
        && this.usuarioTelefoneService.getListUsuario() !== null) {
        //Limpa referência para não atrapalhar outras vezes que entrar no cadastro!
        this.usuarioTelefoneService.getListUsuario().set(localStorage.getItem("token"), null);
      }
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  private instanciaNovoRegistro() {
    this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, new Array<Telefone>, null);
  }

  public cancelar(): void {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      if (localStorage !== undefined
        && localStorage !== null
        && localStorage.getItem("token") !== undefined
        && localStorage.getItem("token") !== null
        && this.usuarioTelefoneService.getListUsuario() !== undefined
        && this.usuarioTelefoneService.getListUsuario() !== null) {
        //Limpa referência para não atrapalhar outras vezes que entrar no cadastro!
        this.usuarioTelefoneService.getListUsuario().set(localStorage.getItem("token"), null);
      }
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
            //Comentamos a mensagem, só será salvo junto com o Usuario (cadastro pai)
            // this.toastService.showSuccesso("Sucesso", "Telefone removido com sucesso!", 2000);
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
      if (localStorage !== undefined
        && localStorage !== null
        && localStorage.getItem("token") !== undefined
        && localStorage.getItem("token") !== null
        && this.usuarioTelefoneService.getListUsuario() !== undefined
        && this.usuarioTelefoneService.getListUsuario() !== null
        && this.usuarioTelefoneService.getListTelefoneSelectVo() !== undefined
        && this.usuarioTelefoneService.getListTelefoneSelectVo() !== null
        && this.usuarioTelefoneService.getListTelefoneEditJson() !== undefined
        && this.usuarioTelefoneService.getListTelefoneEditJson() !== null) {
        //Seta usuário e dados do telefone que será alterado no Service:
        this.usuarioTelefoneService.getListUsuario().set(localStorage.getItem("token"), this.usuario);
        this.usuarioTelefoneService.getListTelefoneSelectVo().set(localStorage.getItem("token"), telefone);
        this.usuarioTelefoneService.getListTelefoneEditJson().set(localStorage.getItem("token"), JSON.stringify(telefone));
      }
      this.router.navigate(["usuario-telefone"]);
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public cadastrarNovoTelefone(): void {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      if (localStorage !== undefined
        && localStorage !== null
        && localStorage.getItem("token") !== undefined
        && localStorage.getItem("token") !== null
        && this.usuarioTelefoneService.getListUsuario() !== undefined
        && this.usuarioTelefoneService.getListUsuario() !== null) {
        //Seta usuário e limpa dados do telefone no service:
        this.usuarioTelefoneService.getListUsuario().set(localStorage.getItem("token"), this.usuario);
        this.usuarioTelefoneService.limpaTelefonesMapUsuarioToken(localStorage.getItem("token"));
      }
      this.router.navigate(["usuario-telefone"]);
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public mostrarOcultarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  private validarSalvar(): boolean {
    if (this.usuario != null) {
      //Nome:
      if (this.usuario.nome === null
        || this.usuario.nome.trim() === "") {
        this.toastService.showWarning("Atenção", "* Nome deve ser informado.", null);
        return false;
      }

      //Login:
      if (this.usuario.login === null
        || this.usuario.login.trim() === "") {
        this.toastService.showWarning("Atenção", "* Login deve ser informado.", null);
        return false;
      }

      //Senha:
      if (this.usuario.id === null) {
        if (this.usuario.senha === null
          || this.usuario.senha.trim() === "") {
          this.toastService.showWarning("Atenção", "* Senha deve ser informada.", null);
          return false;
        }
      }
    }
    return true;
  }

}
