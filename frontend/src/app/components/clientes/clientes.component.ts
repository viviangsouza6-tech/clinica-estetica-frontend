import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];

  novoCliente = {
    nome: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    ativoPessoa: 'S'
  };

  private apiUrl = 'https://localhost:7061/api/Pessoa';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.clientes = dados;
        console.log('Clientes:', dados);
      },
      error: (erro) => {
        console.error('Erro ao buscar clientes:', erro);
      }
    });
  }

  salvarCliente(): void {

    if (
      !this.novoCliente.nome.trim() ||
      !this.novoCliente.dataNascimento ||
      !this.novoCliente.sexo.trim() ||
      !this.novoCliente.email.trim() ||
      !this.novoCliente.telefone.trim()
    ) {
      alert('Preencha todos os campos.');
      return;
    }

    const dadosCliente = {
      nome: this.novoCliente.nome,
      dataNascimento: this.novoCliente.dataNascimento,
      sexo: this.novoCliente.sexo,
      email: this.novoCliente.email,
      telefone: Number(this.novoCliente.telefone),
      ativoPessoa: this.novoCliente.ativoPessoa
    };

    this.http.post(this.apiUrl, dadosCliente).subscribe({
      next: () => {
        alert('Cliente cadastrado com sucesso!');

        this.listarClientes();

        this.novoCliente = {
          nome: '',
          dataNascimento: '',
          sexo: '',
          email: '',
          telefone: '',
          ativoPessoa: 'S'
        };
      },
      error: (erro) => {
        console.error('Erro ao cadastrar cliente:', erro);
        alert('Erro ao cadastrar cliente: ' + JSON.stringify(erro.error));
      }
    });
  }
}