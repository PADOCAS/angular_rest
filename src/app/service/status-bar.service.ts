import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusBarService {
  //BehaviorSubject Boolean e o controle feito pelo ObservableBoolean, para ficar globalizado no projeto, todos componentes poderão utiliza-lo!
  private showStatusDialogSource = new BehaviorSubject<boolean>(false);
  showStatusDialog = this.showStatusDialogSource.asObservable();

  constructor() {
  }

  /**
   * Método responsável para dar ‘show’ ou hide no modal do statusDialog Componente! Tudo controlado pelo service!
   * @param value
   */
  public setShowStatusDialog(value: boolean): void {
    this.showStatusDialogSource.next(value);
  }
}
