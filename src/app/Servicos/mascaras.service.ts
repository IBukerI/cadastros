import { Injectable } from '@angular/core';
import * as validator from 'validator';

@Injectable({
  providedIn: 'root'
})
export class MascarasService {

  public celular = '(00) 0 0000-0000';
  public telefone = '(00) 0000-0000';
  public cep = '00000-000';
  public cpf = '000.000.000-00';
  public cnpj = '00.000.000/0000-00';
  public data = '00/00/0000';

  email(email: string) {
    if (validator.isEmail(email)) {
      return true;
    } else {
      return false;
    }
  }

  constructor() { }
}




