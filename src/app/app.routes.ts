import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {UsuarioComponent} from "./components/usuario/usuario.component";

export const routes: Routes = [
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
