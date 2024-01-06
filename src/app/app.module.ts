import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginService} from "./service/login.service";
import {HeaderInterceptorService} from "./service/header-interceptor.service";
import {UsuarioService} from "./service/usuario.service";
import {StatusBarService} from "./service/status-bar.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    //Vamos prover o uso do LoginService e também UsuarioService para os componentes do módulo:
    //Vamos prover o StatusBarService para qualquer componente utilizar nosso statusBar
    LoginService,
    UsuarioService,
    StatusBarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorService,
      multi: true
    }
  ],
  exports: [
    //Exportar o FormsModule para os componentes filhos enxergarem, sem precisar importar individualmente.
    FormsModule,
    HttpClientModule
  ]
})
export class AppModule {
}
