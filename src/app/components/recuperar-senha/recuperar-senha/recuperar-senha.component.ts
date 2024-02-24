import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {StatusBarService} from "../../../service/status-bar.service";
import {ToastService} from "../../../service/toast.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {RecuperarSenhaService} from "../../../service/recuperar-senha.service";
import {TokenRecuperacaoSenhaDTO} from "../../../../model/tokenRecuperacaoSenhaDTO";

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css', 'recuperar-senha-component.responsive.css']
})
export class RecuperarSenhaComponent implements OnInit {

  mostrarSenha = false;
  mostrarConfirmacaoSenha = false;
  email: string | null = "";
  senha: string | null = "";
  confirmacaoSenha: string | null = "";
  token: string | null = "";

  constructor(private routeActive: ActivatedRoute, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router, private recuperarSenhaService: RecuperarSenhaService) {
  }

  ngOnInit(): void {
    //Ao abrir essa tela, checar se veio os parâmetros aqui, caso não veio avisa o usuário e manda fechar a página!
    if (this.routeActive !== undefined
      && this.routeActive !== null
      && this.routeActive.queryParams !== undefined
      && this.routeActive.queryParams !== null) {
      this.routeActive.queryParams.subscribe(params => {
        this.token = params['token'];
        this.email = params['email'];
      });
    } else {
      this.token = null;
      this.email = null;
    }
  }

  public mostrarOcultarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  public mostrarOcultarConfirmacaoSenha() {
    this.mostrarConfirmacaoSenha = !this.mostrarConfirmacaoSenha;
  }

  public confirmar() {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    if (this.validSalvar()) {
      //Fazer um método na Spring API que recebe uma String (token) onde ele vai checar esses passos abaixo e retorar erro caso encontre!!
      //pode fazer no recuperarSenhaUserController
      let tokenRecuperacaSenha:TokenRecuperacaoSenhaDTO = new TokenRecuperacaoSenhaDTO(this.token, this.email, this.senha);
      this.recuperarSenhaService.confirmAlteracaoSenha(tokenRecuperacaSenha).subscribe(
        data => {
          //Após salvar seria bom fechar essa tela ou voltar para o login, redireciona para lá!
          this.toastService.showSuccesso("Sucesso", "Senha alterada com sucesso!\nVocê será redirecionado para tela de Login!", 2000);
          //Tudo ok, fecha a tela e redireciona para o Login:
          setTimeout(() => {
            this.router.navigate(["login"]);
            this.statusBarService.setShowStatusDialog(false);
            }, 2000
          );
        }, error => {
          this.toastService.showErro("Erro ao Recuperar Senha", error.message, null, error.error);
          this.statusBarService.setShowStatusDialog(false);
        });
    } else {
      this.statusBarService.setShowStatusDialog(false);
    }
  }

  private validSalvar() {
    let msgErro: string = "";

    if (this.email === undefined
      || this.email === null
      || this.email.trim() === "") {
      if (msgErro.length > 0) {
        msgErro += "\n";
      }
      msgErro += "* E-mail para recuperação não informado!\nPara recuperação de senha deve ser utilizado o link recebido no seu e-mail,\nnele constam informações necessárias para confirmar o processo.";
    }

    if (this.token === undefined
      || this.token === null
      || this.token.trim() === "") {
      if (msgErro.length > 0) {
        msgErro += "\n";
      }
      msgErro += "* Token para recuperação não informado!\nPara recuperação de senha deve ser utilizado o link recebido no seu e-mail,\nnele constam informações necessárias para confirmar o processo.";
    }

    //Senha:
    if (this.senha === null
      || this.senha.trim() === "") {
      if (msgErro.length > 0) {
        msgErro += "\n";
      }
      msgErro += "* Senha deve ser informada.";
    } else if (this.senha.length < 3) {
      if (msgErro.length > 0) {
        msgErro += "\n";
      }
      msgErro += "* Senha deve ter no mínimo 3 caracteres.";
    }

    //Confirmação Senha:
    if (this.confirmacaoSenha === null
      || this.confirmacaoSenha.trim() === "") {
      if (msgErro.length > 0) {
        msgErro += "\n";
      }
      msgErro += "* Confirmação de Senha deve ser informada.";
    } else if (this.confirmacaoSenha.length < 3) {
      if (msgErro.length > 0) {
        msgErro += "\n";
      }
      msgErro += "* Confirmação de Senha deve ter no mínimo 3 caracteres.";
    }

    if (this.senha !== undefined
      && this.senha !== null
      && this.senha.trim() !== ""
      && this.confirmacaoSenha !== undefined
      && this.confirmacaoSenha !== null
      && this.confirmacaoSenha.trim() !== "") {
      if (this.senha !== this.confirmacaoSenha) {
        if (msgErro.length > 0) {
          msgErro += "\n";
        }
        msgErro += "* Senha e Confirmação de Senha devem ser iguais.";
      }
    }

    if (msgErro.length > 0) {
      this.toastService.showWarning("Atenção", msgErro, null);
      return false;
    }

    return true;
  }
}
