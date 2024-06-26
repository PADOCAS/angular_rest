import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {UsuarioComponent} from "./components/usuario/usuario.component";
import {UsuarioFormComponent} from "./components/usuario/usuario-form/usuario-form.component";
import {RouterGuard} from "./guard/router.guard";
import {UsuarioTelefoneFormComponent} from "./components/usuario/usuario-telefone-form/usuario-telefone-form.component";
import {RecuperarSenhaComponent} from "./components/recuperar-senha/recuperar-senha/recuperar-senha.component";
import {UsuarioReportComponent} from "./components/usuario/usuario-report/usuario-report.component";
import {UsuarioBarChartComponent} from "./components/usuario/usuario-bar-chart/usuario-bar-chart.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";

export const routes: Routes = [
  {path: "usuario-bar-chart", component: UsuarioBarChartComponent, canActivate: [RouterGuard]}, //Gráficos de Barras - Salários Usuário //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "usuario-report", component: UsuarioReportComponent, canActivate: [RouterGuard]}, //Relatório de Usuários //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "usuario-add", component: UsuarioFormComponent, canActivate: [RouterGuard]}, //Cadastro de Usuário - adicionar novo //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "usuario-edit/:id", component: UsuarioFormComponent, canActivate: [RouterGuard]}, //Cadastro de usuário - editar recebendo parâmetro //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "usuario-telefone", component: UsuarioTelefoneFormComponent, canActivate: [RouterGuard]}, //Cadastro de telefones do usuário (recebe objetos telefone/usuario por service) //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "usuarioList", component: UsuarioComponent, canActivate: [RouterGuard]}, //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "home", component: HomeComponent, canActivate: [RouterGuard]}, //Definimos o RouterGuard para checar token antes de ir para rota!
  {path: "login", component: LoginComponent}, //Essas são acessadas sem precisar do token ainda, liberadas! (não precisa do guard)
  {path: "recuperar-senha", component: RecuperarSenhaComponent}, //Essas são acessadas sem precisar do token ainda, liberadas! (não precisa do guard)
  {path: "", redirectTo: '/login', pathMatch: 'full'}, //Sem URI passado redireciona para o login
  {path: "**", component: PageNotFoundComponent} //Página não encontrada para erros 404!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutes {
}
