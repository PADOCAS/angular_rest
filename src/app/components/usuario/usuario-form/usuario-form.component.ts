import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../menu/menu.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Usuario} from "../../../../model/usuario";
import {UsuarioService} from "../../../service/usuario.service";
import {FormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {ViaCep} from "../../../../model/viaCep";
import {StatusBarComponent} from "../../util/status-bar/status-bar.component";
import {StatusBarService} from "../../../service/status-bar.service";

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    MenuComponent,
    RouterLink,
    FormsModule,
    NgIf,
    NgClass,
    StatusBarComponent
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  usuario: Usuario = new Usuario(null, null, null, null, null, null, null, null, null, null);

  constructor(private routeActive: ActivatedRoute, private usuarioService: UsuarioService, private statusBarService: StatusBarService) {
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

  public consultaCep() {
    this.statusBarService.setShowStatusDialog(true);

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
              if (data !== null) {
                viaCep = data;

                if (viaCep !== null) {
                  this.usuario.logradouro = viaCep.logradouro;
                  this.usuario.bairro = viaCep.bairro;
                  this.usuario.localidade = viaCep.localidade;
                  this.usuario.complemento = viaCep.complemento;
                  this.usuario.uf = viaCep.uf;
                } else {
                  console.error("Erro ao consultar CEP");
                }
              }
            }, error => {
              console.error("Erro ao consultar CEP: " + error);
            });
        } else {
          console.error("CEP inválido, informe apenas números!");
        }
      }

      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public salvar(): void {
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      //Todo: Salvar!

      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public novo(): void {
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null);

      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public cancelar(): void {
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      this.statusBarService.setShowStatusDialog(false);
    });
  }
}
