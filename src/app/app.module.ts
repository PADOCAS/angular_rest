import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginService} from "./service/login.service";
import {HeaderInterceptorService} from "./service/header-interceptor.service";
import {UsuarioService} from "./service/usuario.service";
import {StatusBarService} from "./service/status-bar.service";
import {NgbModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from "./service/toast.service";
import {RouterGuard} from "./guard/router.guard";
import {UsuarioTelefoneService} from "./service/usuario-telefone.service";
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";
import {NgxPaginationModule} from "ngx-pagination";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ValidatorUtilService} from "./service/validator-util.service";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxCurrencyDirective} from "ngx-currency";
import {RecuperarSenhaService} from "./service/recuperar-senha.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbToastModule,
    //Imports para máscara em nosso sistema, exemplo número telefone:
    NgxMaskDirective,
    NgxMaskPipe,
    //Import para paginator:
    NgxPaginationModule,
    //Importa para datePicker ng bootstrap:
    NgbModule,
    FontAwesomeModule,
    //NgSelectModule - AutoComplete ng, import module:
    NgSelectModule,
    //NgxCurrencyDirective -> Campo valores:
    NgxCurrencyDirective
  ],
  providers: [
    //Vamos prover o uso do LoginService e também UsuarioService para os componentes do módulo:
    //Vamos prover o StatusBarService para qualquer componente utilizar nosso statusBar
    //Vamos prover o ToastService para qualquer componente utilizar nosso componente de mensagem para o usuário
    //Vamor prover o ValidatorUtilService para qualquer componente utilizar nosso validator geral Util
    //Vamor prover o RecuperarSenhaService para o componente utilizar o RecupearSenhaService
    LoginService,
    UsuarioService,
    StatusBarService,
    ToastService,
    UsuarioTelefoneService,
    ValidatorUtilService,
    RecuperarSenhaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorService,
      multi: true
    },
    RouterGuard,
    //Prover o ngxMask para utilizar campos mascarados em nosso sistema, exemplo número telefone
    provideNgxMask(),
  ],
  exports: [
    //Exportar o FormsModule para os componentes filhos enxergarem, sem precisar importar individualmente.
    FormsModule,
    HttpClientModule,
    NgbToastModule
  ]
})
export class AppModule {
}
