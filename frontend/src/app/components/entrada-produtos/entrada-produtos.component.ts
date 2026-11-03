
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
    produto: '',
    iditem: 0,
    identradaProduto: 0,
    dataEntradaProduto: '',
    quantidadeEntrada: 0,
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

    if (
      !this.novaEntrada.produto.trim() ||
      !this.novaEntrada.dataEntradaProduto ||
      this.novaEntrada.quantidadeEntrada <= 0 ||
      this.novaEntrada.valorUnitarioEntrada <= 0
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const produtoEncontrado = this.produtos.find(
      item => item.item1?.toLowerCase() ===
      this.novaEntrada.produto.trim().toLowerCase()
    );

    if (!produtoEncontrado) {
      alert('Produto não encontrado. Cadastre primeiro na tela de Produtos.');
      return;
    }

    const dadosEntrada = {
      identradaProduto: 0,
      iditem: produtoEncontrado.iditem,
      dataEntradaProduto: this.novaEntrada.dataEntradaProduto,
      quantidadeEntrada: this.novaEntrada.quantidadeEntrada,
      unidade: produtoEncontrado.unidade || 'UN',
      valorUnitarioEntrada: this.novaEntrada.valorUnitarioEntrada
    };

    this.http.post(this.apiUrl, dadosEntrada).subscribe({
      next: () => {
        alert('Entrada cadastrada com sucesso!');
        this.listarEntradas();

        this.novaEntrada = {
          produto: '',
          iditem: 0,
          identradaProduto: 0,
          dataEntradaProduto: '',
          quantidadeEntrada: 0,
          valorUnitarioEntrada: 0
        };
      },
      error: (erro) => {
        console.error('Erro ao cadastrar entrada:', erro);
        alert('Erro ao cadastrar entrada: ' + JSON.stringify(erro.error));
      }
    });
  }
}
