
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-atendimento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atendimento.component.html',
  styleUrl: './atendimento.component.css'
})
export class AtendimentoComponent implements OnInit {

  private apiPessoa = 'https://localhost:7061/api/Pessoa';
  private apiAtendimento = 'https://localhost:7061/api/Atendimento';

  pessoas: any[] = [];

  atendimento = {
    idpessoa: 0,
    dataAtendimento: '',
    statusAtendimento: ''
  };

  mensagem = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarPessoas();
  }

  listarPessoas(): void {
    this.http.get<any[]>(this.apiPessoa).subscribe({
      next: (dados) => {
        this.pessoas = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar pessoas:', erro);
        this.mensagem = 'Não foi possível carregar as pessoas.';
      }
    });
  }

  salvarAtendimento(): void {

    if (
      this.atendimento.idpessoa === 0 ||
      !this.atendimento.dataAtendimento ||
      !this.atendimento.statusAtendimento
    ) {
      this.mensagem = 'Preencha todos os campos!';
      return;
    }

    const dados = {
      idpessoa: this.atendimento.idpessoa,
      dataAtendimento: this.atendimento.dataAtendimento,
      statusAtendimento: this.atendimento.statusAtendimento
    };

    this.http.post(this.apiAtendimento, dados).subscribe({
      next: () => {
        this.mensagem = 'Atendimento cadastrado com sucesso!';

        this.atendimento = {
          idpessoa: 0,
          dataAtendimento: '',
          statusAtendimento: ''
        };
      },
      error: (erro) => {
        console.error('Erro ao salvar atendimento:', erro);
        this.mensagem = 'Erro ao cadastrar atendimento.';
      }
    });
  }
}
