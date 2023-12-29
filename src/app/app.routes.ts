import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {UsuarioComponent} from "./components/usuario/usuario.component";
import {UsuarioFormComponent} from "./components/usuario/usuario-form/usuario-form.component";

export const routes: Routes = [
  {path: "usuario-add", component: UsuarioFormComponent}, //Cadastro de Usuário - adicionar novo
  {path: "usuario-edit/:id", component: UsuarioFormComponent}, //Cadastro de usuário - editar recebendo parâmetro
  {path: "usuarioList", component: UsuarioComponent},
  {path: "home", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutes {
}
