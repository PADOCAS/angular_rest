import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../../model/usuario";
import {Observable} from "rxjs";
import {Constants} from "../../util/constants";
import {ViaCep} from "../../model/viaCep";
import {UsuarioReport} from "../../model/usuarioReport";
import {StatusBarService} from "./status-bar.service";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private statusBarService: StatusBarService, private toastService: ToastService) {
  }

  /**
   * Método responsável por listar todos os usuários cadastrados (../usuario/listall)
   *
   */
  public getListUsuarios(): Observable<any> {
    //Retorna um Pageable com os Usuários:
    return this.http.get<any>(Constants.baseUrl + "listall");
  }

  /**
   * Método responsável por listar todos os usuários para a página (../usuario/page/...)
   *
   * @param page (number)
   */
  public getPageUsuarios(page: number): Observable<any> {
    //Retorna um Page com os usuários:
    return this.http.get<any>(Constants.baseUrl + "page/" + page);
  }

  /**
   * Método responsável para chamar o delete Usuario da API (../usuario/{id})
   *
   * @param id (id do usuário -> number)
   */
  public deleteUsuario(id: number): Observable<any> {
    return this.http.delete(Constants.baseUrl + id, {responseType: "text"});
  }

  public getListUsuarioPorNome(nome: string): Observable<any> {
    //Retorna um Page com os Usuários filtrados por nome:
    return this.http.get<any>(Constants.baseUrl + "usuariopornome/" + nome);
  }

  public getPageUsuarioPorNome(nome: string, page: number): Observable<any> {
    //Retorna um Page com os Usuários filtrados por nome para a página que o usuário vai navegar:
    return this.http.get<any>(Constants.baseUrl + "pageusuariopornome/" + page + "/" + nome);
  }

  public getUsuario(id: number): Observable<any> {
    //Método para retornar por ID está versionado na API, devemos pegar o que retorna todas as informações do VO!
    //Deve ser passado no header o parâmetro para API (X-API-Version=v1)
    const headers = {
      'X-API-Version': 'v1'
    };

    return this.http.get<Usuario>(Constants.baseUrl + id, {headers});
  }

  // public isUserAutenticado() {
  //   if (localStorage != null) {
  //     let token = localStorage.getItem("token");
  //
  //     if (token != null
  //       && token.trim().length > 0) {
  //       return true;
  //     }
  //   }
  //
  //   return false;
  // }

  /**
   * Consulta API VIACEP para buscar o cep informado
   * @param cep
   */
  public getConsultaCep(cep: string): Observable<any> {
    //Consulta CEP API VIACEP - JSON
    return this.http.get<ViaCep>(Constants.viaCepUrl + cep + "/json/");
  }

  /**
   * Consulta API buscando todas as profissões cadastradas
   */
  public getListProfissao(): Observable<any> {
    return this.http.get<any>(Constants.baseUrlPath + "profissao/");
  }

  /**
   * Salvar Usuario (POST)
   * @param usuario
   */
  public saveUsuario(usuario: Usuario): Observable<any> {
    return this.http.post<Usuario>(Constants.baseUrl, usuario);
  }

  /**
   * Editar Usuario (PUT)
   * @param usuario
   */
  public editarUsuario(usuario: Usuario): Observable<any> {
    //Convertendo para um novo objeto e enviando para API (para não enviar com informações de ROLE etc.. que vieram do FIND, deixamos o objeto apenas com o necessário antes de editar!)
    let usuarioPutCharged: Usuario = new Usuario(usuario.id, usuario.login, usuario.senha, usuario.nome, usuario.cep, usuario.bairro, usuario.localidade, usuario.logradouro, usuario.complemento, usuario.uf, usuario.dataNascimento, usuario.cpf, usuario.email, usuario.profissao, usuario.salario, usuario.listTelefone, usuario.listRole);
    return this.http.put<Usuario>(Constants.baseUrl, usuarioPutCharged);
  }

  public getDadosGraficoSalario(): Observable<any> {
    return this.http.get(Constants.baseUrl + "graficosalario");
  }

  public downloadReportUsuarioPdf() {
    return this.http.get(Constants.baseUrl + "relatorio", {responseType: "text"}).subscribe(
      data => {
        if (data !== undefined
          && data !== null
          && data !== '') {
          //Abre o Modal:
          let modalElement = document.getElementById('modalImpressaoPdf');
          if (modalElement) {
            modalElement.classList.add('show');
            modalElement.style.display = 'block';
          }

          // Verifica se o elemento iframe existe:
          let iframeElement = document.querySelector('iframe');
          if (iframeElement !== undefined
            && iframeElement !== null
            && iframeElement.src !== null) {
            // Define o src do iframe com o valor recebido
            iframeElement.src = data;
          }

          this.statusBarService.setShowStatusDialog(false);
        } else {
          this.toastService.showWarning("Atenção", "Nenhum registro encontrado.", 2000);
          this.statusBarService.setShowStatusDialog(false);
        }
      },
      error => {
        let errorObj = null;

        //Usei o JSON.parse, direto não converteu corretamente o JSON nesse método!
        if (error !== undefined
          && error !== null
          && error.error !== undefined
          && error.error !== null) {
          errorObj = JSON.parse(error.error);
        }

        this.toastService.showErro("Erro ao gerar Relatório", error.message, null, errorObj);
        this.statusBarService.setShowStatusDialog(false);
      });
  }

  public downloadReportUsuarioPdfWithParam(usuarioReport: UsuarioReport) {
    return this.http.post(Constants.baseUrl + "relatorio/", usuarioReport, {responseType: "text"}).subscribe(
      data => {
        if (data !== undefined
          && data !== null
          && data !== '') {
          //Abre o Modal:
          let modalElement = document.getElementById('modalImpressaoPdf');

          if (modalElement) {
            modalElement.classList.add('show');
            modalElement.style.display = 'block';
            // Verifica se o elemento iframe existe:
            let iframeElement = document.querySelector('iframe');

            if (iframeElement !== undefined
              && iframeElement !== null
              && iframeElement.src !== null) {
              // Define o src do iframe com o valor recebido
              iframeElement.src = data;
            }
          }

          this.statusBarService.setShowStatusDialog(false);
        } else {
          this.toastService.showWarning("Atenção", "Nenhum registro encontrado.", 2000);
          this.statusBarService.setShowStatusDialog(false);
        }
      },
      error => {
        let errorObj = null;

        //Usei o JSON.parse, direto não converteu corretamente o JSON nesse método!
        if (error !== undefined
          && error !== null
          && error.error !== undefined
          && error.error !== null) {
          errorObj = JSON.parse(error.error);
        }
        this.toastService.showErro("Erro ao gerar Relatório", error.message, null, errorObj);
        this.statusBarService.setShowStatusDialog(false);
      });
  }
}
