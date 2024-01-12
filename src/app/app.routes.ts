import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {UsuarioComponent} from "./components/usuario/usuario.component";
import {UsuarioFormComponent} from "./components/usuario/usuario-form/usuario-form.component";
import {RouterGuard} from "./guard/router.guard";

export const routes: Routes = [
  {path: "usuario-add", component: UsuarioFormComponent, canActivate: [RouterGuard]}, //Cadastro de Usuário - adicionar novo //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "usuario-edit/:id", component: UsuarioFormComponent, canActivate: [RouterGuard]}, //Cadastro de usuário - editar recebendo parâmetro //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "usuarioList", component: UsuarioComponent, canActivate: [RouterGuard]}, //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "home", component: HomeComponent, canActivate: [RouterGuard]}, //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "login", component: LoginComponent}, //Essas são acessadas sem precisar do token ainda, liberadas! (não precisa do guard)
  {path: "", component: LoginComponent} //Essas são acessadas sem precisar do token ainda, liberadas! (não precisa do guard)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutes {
}
