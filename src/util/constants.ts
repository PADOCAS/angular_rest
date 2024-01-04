/**
 * Métodos e atributos constantes para facilitar a utilização da API REST na nossa aplicação
 */
export class Constants {

  public static get baseServidor(): string {
    return "http://localhost:8080/";
  }

  public static get baseLogin(): string {
    return this.baseServidor + "springbootapirest/login";
  }

  public static get baseUrl(): string {
    return this.baseServidor + "springbootapirest/usuario/";
  }

  public static get viaCepUrl(): string {
    return "https://viacep.com.br/ws/";
  }
}
