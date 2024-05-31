import { ValidaCpfService } from '../Servicos/valida-cpf.service';
import { ConsultaCepService } from '../Servicos/consulta-cep.service';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MascarasService } from '../Servicos/mascaras.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsultaCnpjService } from '../Servicos/consulta-cnpj.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css']
})
export class CadastroClienteComponent {
  cpfInvalido: boolean = false;
  cepInvalido: boolean = false;
  emailInvalido: boolean = false;

  form: FormGroup = this.fb.group({
      tipo: ['fisica'],
      nome: ['',[Validators.required]],
      sobrenome: ['',[Validators.required]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', [Validators.maxLength(10), Validators.required]],
      razaoSocial: ['', [Validators.required]],
      nomeFantasia: ['',[Validators.required]],
      cnpj: ['', [Validators.minLength(14), Validators.required]],
      cep: ['',[Validators.required]],
      telefoneFixo: [''],
      telefoneCelular: ['',[Validators.required]],
      logradouro: ['',[Validators.required]],
      numero: [''],
      bairro: ['',[Validators.required]],
      cidade: ['',[Validators.required]],
      estado: ['',[Validators.required]],
      complemento: [''],
      pessoaContato: ['',[Validators.required]],
      email: ['', [Validators.required]],

    });

    constructor(private fb: FormBuilder, public mascaras: MascarasService,
     private ConsultaCepService: ConsultaCepService, private ValidaCpfService: ValidaCpfService, private snackBar: MatSnackBar,
      private ConsultaCnpjService: ConsultaCnpjService, private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

    }

    onTipoChange(tipo: string) {

    }

    buscarDadosCep() {
      const cep = this.form.get('cep')?.value;
        if (cep) {
          this.ConsultaCepService.buscarCep(cep).subscribe(
            data => {
              this.form.get('logradouro')?.setValue(data.street);
              this.form.get('bairro')?.setValue(data.neighborhood);
              this.form.get('cidade')?.setValue(data.city);
              this.form.get('estado')?.setValue(data.state);
            },
            error => {
              this.cepInvalido = true;
            }
          );
        }
    }

    validaCpf() {
      const cpf = this.form.get('cpf')?.value;
      if (cpf) {
        if (!this.ValidaCpfService.validaCPF(cpf)) {
          this.snackBar.open('CPF inválido', 'Fechar', {
            duration: 3000,
            panelClass: ['red-snackbar']
          });
        }
        if (!this.cpfInvalido) {
          console.log('CPF válido, buscar no banco se já existe cadastro com esse CPF')
          this.consultaCpf(cpf);
        }
      }
    }

    onSubmit() {
      if (this.form.valid) {
        this.form.reset();
        Swal.fire({
          title: 'Sucesso!',
          text: 'Cliente cadastrado com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.form.reset();
          }
        });
      } else {
        Swal.fire({
          title: 'Não foi possível cadastrar o cliente',
          text: 'Campos com erros ou em branco!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }

    consultaCpf(cpf: string) {
      console.log('Consulta no banco de dados se já existe cadastro com esse CPF');
    }

    buscarDadosCNPJ() {
      const cnpj = this.form.get('cnpj')?.value;
      if (cnpj) {
        let resp;
        this.ConsultaCnpjService.buscarDadosCNPJ(cnpj).subscribe(
          data => {
            if(data.situacao_cadastral === 2 || data.situacao_cadastral === 5) {
              this.form.get('razaoSocial')?.setValue(data.razao_social);
              this.form.get('nomeFantasia')?.setValue(data.nome_fantasia);
              this.form.get('cep')?.setValue(data.cep);
              if (data.cep) {
                this.buscarDadosCep();
              }
            } else if (data.situacao_cadastral === 8) {
              this.snackBar.open('CNPJ Baixado', 'Fechar', {
                duration: 3000,
              });
            } else if (data.situacao_cadastral === 3) {
              this.snackBar.open('CNPJ Suspenso', 'Fechar', {
                duration: 3000,
              });
            } else if (data.situcao_cadastral === 4){
              this.snackBar.open('CNPJ Inapto', 'Fechar', {
                duration: 3000,
              });
            } else if (data.situacao_cadastral === 1) {
              this.snackBar.open('CNPJ Nulo', 'Fechar', {
                duration: 3000,
              });
            }

          },
          error => {
            this.snackBar.open('CNPJ Inválido', 'Fechar', {
              duration: 3000,
              panelClass: ['red-snackbar']
            });
          }
        );
        if (resp) {
          console.log('CNPJ válido, buscar no banco se já existe cadastro com esse CNPJ');
          this.consultaCnpj(cnpj);
        }
      }
    }

    consultaCnpj(cnpj: string) {
      console.log('Consulta no banco de dados se já existe cadastro com esse CNPJ');

    }


   }



