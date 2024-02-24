/**
 * Métodos e atributos constantes para facilitar a utilização da API REST na nossa aplicação
 */
export class Constants {

  public static get baseServidor(): string {
    //Para rodar localmente, precisamos por o IP da máquina local (base Teste)
    // return "http://localhost:8080/";
    //Para rodar Produção:
    return "http://192.168.0.17:8080/";
  }

  public static get baseLogin(): string {
    return this.baseServidor + "springbootapirest/login";
  }

  public static get baseUrl(): string {
    return this.baseServidor + "springbootapirest/usuario/";
  }

  /**
   * Base URL Path para acessar qualquer controller da API
   */
  public static get baseUrlPath(): string {
    return this.baseServidor + "springbootapirest/";
  }

  public static get viaCepUrl(): string {
    return "https://viacep.com.br/ws/";
  }
}
