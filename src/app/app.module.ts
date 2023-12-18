import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LoginService} from "./service/login.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    //Vamos prover o uso do LoginService para os componentes do módulo:
    LoginService
  ],
  exports: [
    //Exportar o FormsModule para os componentes filhos enxergarem, sem precisar importar individualmente.
    FormsModule,
    HttpClientModule
  ]
})
export class AppModule {
}
