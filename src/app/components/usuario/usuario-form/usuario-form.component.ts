import {Component, ElementRef, OnInit} from '@angular/core';
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
import {NgxMaskDirective, NgxMaskPipe} from "ngx-mask";
import {NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCalendarAlt} from "@fortawesome/free-solid-svg-icons";
import {FormatData} from "../../../../util/FormatData";
import {FormatDateAdapter} from "../../../../util/FormatDateAdapter";
import {ValidatorUtilService} from "../../../service/validator-util.service";
import {ErrorMessage} from "../../../../model/errorMessage";
import {Profissao} from "../../../../model/profissao";
import {NgSelectModule} from "@ng-select/ng-select";
import {of, switchMap, tap} from "rxjs";
import {NgxCurrencyDirective} from "ngx-currency";

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    MenuComponent,
    RouterLink,
    FormsModule,
    NgIf,
    NgClass,
    NgForOf,
    NgxMaskPipe,
    NgbInputDatepicker,
    FaIconComponent,
    NgxMaskDirective,
    NgSelectModule,
    NgxCurrencyDirective
  ],
  //Prove as classes para trabalhar com Formatação de Data pt-Br
  providers: [
    [{
      provide: NgbDateParserFormatter, useClass: FormatData
    }, {
      provide: NgbDateAdapter, useClass: FormatDateAdapter
    }],
  ],
  // providers: [
  //   [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}],
  //   [{provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}],
  // ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css', './usuario-form.component.responsive.css']
})
export class UsuarioFormComponent implements OnInit {
  usuario: Usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null,  null, null, 0.00, new Array<Telefone>, null);
  mostrarSenha = false;
  listProfissao: Array<Profissao> | any = null;

  constructor(private routeActive: ActivatedRoute, private usuarioService: UsuarioService, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router, private usuarioTelefoneService: UsuarioTelefoneService, private elementRef: ElementRef, private validatorUtilService: ValidatorUtilService) {
  }

  ngOnInit(): void {
    //Executando funções em cascata e depois fecha o statusBar:
    this.usuarioService.getListProfissao().pipe(
      switchMap(data => {
        this.listProfissao = data;
        // console.log("1-Carreguei profissão...");
        //Passar return of(null) caso contrário se for uma data com objetos preenchidos ele fica passando 1 a 1 no switchMap abaixo (NÃO QUEREMOS ISSO)
        return of(null);
      }), switchMap(() => {
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
          //Retorna o Usuário carregado para a próxima TAP fazer o set no vo e depois fechar o status bar
          return this.usuarioService.getUsuario(Number(this.routeActive.snapshot.paramMap.get('id')));
        }
        //Retorn observable null, pois apenas vamos trabalhar esse retorno quando for abrir o editar do registro!
        return of(null);
      }), tap(data => {
        if (data !== undefined
          && data !== null) {
          this.usuario = data;
          //Quando está editando registro, ele vem com um find em profissão, precisamos alimentar o campo idDescricaoFormatted onde vai usar no ng-select:
          if (this.usuario !== undefined
            && this.usuario !== null
            && this.usuario.profissao !== undefined
            && this.usuario.profissao !== null
            && this.usuario.profissao.id !== undefined
            && this.usuario.profissao.id !== null
            && this.usuario.profissao.descricao !== undefined
            && this.usuario.profissao.descricao !== null) {
            this.usuario.profissao.idDescricaoFormatted = `(${this.usuario.profissao.id}) ${this.usuario.profissao.descricao}`;
          }
          // console.log("2-Carreguei o Usuário para alteração...");
        }

        if (this.elementRef !== null
          && this.elementRef.nativeElement.querySelector('#txtNome') !== undefined
          && this.elementRef.nativeElement.querySelector('#txtNome') !== null) {
          //Dar Foco no campo Nome ao iniciar tela:
          this.elementRef.nativeElement.querySelector('#txtNome').focus();
        }
      })
    ).subscribe(
      () => {
        //Fecha o statusBar:
        this.statusBarService.setShowStatusDialog(false);
      },
      () => {
        //Fecha o statusBar:
        this.statusBarService.setShowStatusDialog(false);
      }
    );
  }

  /**
   * Método para ao ganhar foco, selecionar tudo para alteração
   */
  public focusOnDecimal() {
    let inputElement = document.getElementById('txtSalario') as HTMLInputElement;
    let salario = inputElement.value;

    if (salario !== undefined
      && salario !== null
      && salario.trim() !== '') {
      //Caso tiver algo preenchido ele ja seleciona tudo para alteração ficar mais simples:
      inputElement.selectionStart = 0;
      inputElement.selectionEnd = inputElement.value.length;
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
          // console.log(this.usuario.profissao);
          if (this.usuario.id !== null
            && this.usuario.id.toString().trim() !== null) {
            //Atualizando Registro:
            this.usuarioService.editarUsuario(this.usuario)
              .subscribe(() => {
                //Limpa o cadastro para deixar pronto para salvar um novo registro se necessário:
                // this.instanciaNovoRegistro();
                this.toastService.showSuccesso("Sucesso", "Usuário atualizado com sucesso!", 2000);
                this.router.navigate(["usuarioList"]);
                this.statusBarService.setShowStatusDialog(false);
              }, error => {
                if (error.status !== null
                  && error.status === 403) {
                  //Erro 403 recusa do servidor (token faltando para requisição), mandamos uma mensagem genérica e encaminhamos para o login novamente:
                  this.toastService.showErro("Erro ao salvar Usuário", "Usuário sem Token válido,\nRefaça o Login e tente novamente.", 3000, null);
                  localStorage.removeItem("token"); //Remove o Token do usuário e redireciona para Login
                  this.router.navigate(["login"]);
                } else {
                  this.toastService.showErro("Erro ao salvar Usuário", error.message, null, error.error);
                }
                this.statusBarService.setShowStatusDialog(false);
              });
          } else {
            //Novo Registro:
            this.usuarioService.saveUsuario(this.usuario)
              .subscribe(() => {
                //Limpa o cadastro para deixar pronto para salvar um novo registro se necessário:
                // this.instanciaNovoRegistro();
                this.toastService.showSuccesso("Sucesso", "Usuário salvo com sucesso!", 2000);
                this.router.navigate(["usuarioList"]);
                this.statusBarService.setShowStatusDialog(false);
              }, error => {
                if (error.status !== null
                  && error.status === 403) {
                  //Erro 403 recusa do servidor (token faltando para requisição), mandamos uma mensagem genérica e encaminhamos para o login novamente:
                  this.toastService.showErro("Erro ao salvar Usuário", "Usuário sem Token válido,\nRefaça o Login e tente novamente.", 3000, null);
                  localStorage.removeItem("token"); //Remove o Token do usuário e redireciona para Login
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
      this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.00, new Array<Telefone>, null);
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

  // private instanciaNovoRegistro() {
  //   this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.00, new Array<Telefone>, null);
  // }

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
      //Vamos fechar o statusBar ao Abrir a tela do telefone!
      //this.statusBarService.setShowStatusDialog(false);
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
    let msgErro: string = "";

    if (this.usuario != null) {
      //Nome:
      if (this.usuario.nome === null
        || this.usuario.nome.trim() === "") {
        if (msgErro.length > 0) {
          msgErro += "\n";
        }
        msgErro += "* Nome deve ser informado.";
      }

      //Email:
      if (this.usuario.email === null
        || this.usuario.email.trim() === "") {
        if (msgErro.length > 0) {
          msgErro += "\n";
        }
        msgErro += "* E-mail deve ser informado.";
      }

      //Login:
      if (this.usuario.login === null
        || this.usuario.login.trim() === "") {
        if (msgErro.length > 0) {
          msgErro += "\n";
        }
        msgErro += "* Login deve ser informado.";
      }

      //Senha:
      if (this.usuario.id === null) {
        if (this.usuario.senha === null
          || this.usuario.senha.trim() === "") {
          if (msgErro.length > 0) {
            msgErro += "\n";
          }
          msgErro += "* Senha deve ser informada.";
        } else if (this.usuario.senha.length < 3) {
          if (msgErro.length > 0) {
            msgErro += "\n";
          }
          msgErro += "* Senha deve ter no mínimo 3 caracteres.";
        }
      }

      //Data Nascimento:
      if (this.usuario.dataNascimento !== undefined
        && this.usuario.dataNascimento !== null
        && this.usuario.dataNascimento.trim() !== "") {
        //Cria um Objeto e passa a msg dentro para tratar caso der erro, acessar a msg atualizada!
        //Caso mandar apenas a msg para o método será outra referência!
        let errorMsgAux: ErrorMessage = new ErrorMessage(msgErro);
        if (!this.validatorUtilService.isValidDate(this.usuario.dataNascimento, errorMsgAux)) {
          msgErro = errorMsgAux.msg;
        }
      }
    }

    if (msgErro.length > 0) {
      this.toastService.showWarning("Atenção", msgErro, null);
      return false;
    }

    return true;
  }

  public getTelefoneMask(telefone: Telefone): string {
    if (telefone !== null
      && telefone.tipo !== undefined
      && telefone.tipo !== null
      && telefone.tipo !== "null"
      && telefone.tipo.trim() !== "") {
      switch (telefone.tipo) {
        case 'CELULAR':
          return '(00)00000-0000';
        default:
          return '(00)0000-0000';
      }
    }

    return '';
  }

  public validatorUtil(): ValidatorUtilService {
    return this.validatorUtilService;
  }

  public onChangeCpf(value: string): void {
    // Verifica se o valor é vazio e define como null se for
    this.usuario.cpf = value.trim() === '' ? null : value;
  }

  protected readonly faCalendarAlt = faCalendarAlt;
}
