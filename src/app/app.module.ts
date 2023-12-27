import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginService} from "./service/login.service";
import {HeaderInterceptorService} from "./service/header-interceptor.service";
import {UsuarioService} from "./service/usuario.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    //Vamos prover o uso do LoginService e também UsuarioService para os componentes do módulo:
    LoginService,
    UsuarioService,
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
