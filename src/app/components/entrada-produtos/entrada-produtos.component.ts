import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrada-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrada-produtos.component.html',
  styleUrl: './entrada-produtos.component.css'
})
export class EntradaProdutosComponent implements OnInit {

  entradas: any[] = [];
  produtos: any[] = [];

  novaEntrada = {
    identradaProduto: 0,
    iditem: 0,
    dataEntradaProduto: '',
    quantidadeEntrada: 0,
    unidade: '',
    valorUnitarioEntrada: 0
  };

  private apiUrl = 'https://localhost:7061/api/EntradaProduto';
  private apiItemUrl = 'https://localhost:7061/api/Item';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarEntradas();
    this.listarProdutos();
  }

  listarEntradas(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.entradas = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar entradas:', erro);
      }
    });
  }

  listarProdutos(): void {
    this.http.get<any[]>(this.apiItemUrl).subscribe({
      next: (dados) => {
        this.produtos = dados.filter(item => item.tipoItem === 'P');
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos:', erro);
      }
    });
  }

  salvarEntrada(): void {
    this.http.post(this.apiUrl, this.novaEntrada).subscribe({
      next: () => {
        alert('Entrada cadastrada com sucesso!');

        this.listarEntradas();

        this.novaEntrada = {
          identradaProduto: 0,
          iditem: 0,
          dataEntradaProduto: '',
          quantidadeEntrada: 0,
          unidade: '',
          valorUnitarioEntrada: 0
        };
      },
      error: (erro) => {
        console.error('Erro ao cadastrar entrada:', erro);
        alert('Erro ao cadastrar entrada.');
      }
    });
  }
}