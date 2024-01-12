import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginService} from "./service/login.service";
import {HeaderInterceptorService} from "./service/header-interceptor.service";
import {UsuarioService} from "./service/usuario.service";
import {StatusBarService} from "./service/status-bar.service";
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from "./service/toast.service";
import {RouterGuard} from "./guard/router.guard";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbToastModule
  ],
  providers: [
    //Vamos prover o uso do LoginService e também UsuarioService para os componentes do módulo:
    //Vamos prover o StatusBarService para qualquer componente utilizar nosso statusBar
    //Vamos prover o ToastService para qualquer componente utilizar nosso componente de mensagem para o usuário
    LoginService,
    UsuarioService,
    StatusBarService,
    ToastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorService,
      multi: true
    },
    RouterGuard,
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
