
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

  apiUrl = 'https://localhost:7061/api/EntradaProduto';
  itemUrl = 'https://localhost:7061/api/Item';

  entradas: any[] = [];
  todosItens: any[] = [];
  produtosDisponiveis: any[] = [];

  novaEntrada: any = {
    iditem: null,
    dataEntradaProduto: '',
    quantidadeEntrada: 0,
    valorUnitarioEntrada: 0
  };

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
        console.error('Erro ao carregar entradas:', erro);
        alert('Erro ao carregar entradas.');
      }
    });
  }

  listarProdutos(): void {
    this.http.get<any[]>(this.itemUrl).subscribe({
      next: (dados) => {
        this.todosItens = dados;

        this.produtosDisponiveis = dados.filter(item =>
          item.tipoItem === 'P' &&
          item.ativoProdutoServico === 'S'
        );
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
        alert('Erro ao carregar produtos.');
      }
    });
  }

  nomeProduto(iditem: number): string {
    const produto = this.todosItens.find(item => item.iditem === iditem);
    return produto ? produto.item1 : 'Produto não encontrado';
  }

  salvarEntrada(): void {
    if (
      !this.novaEntrada.iditem ||
      !this.novaEntrada.dataEntradaProduto ||
      this.novaEntrada.quantidadeEntrada <= 0 ||
      this.novaEntrada.valorUnitarioEntrada <= 0
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const dadosEntrada = {
      iditem: Number(this.novaEntrada.iditem),
      dataEntradaProduto: this.novaEntrada.dataEntradaProduto,
      quantidadeEntrada: Number(this.novaEntrada.quantidadeEntrada),
      valorUnitarioEntrada: Number(this.novaEntrada.valorUnitarioEntrada)
    };

    console.log('Dados enviados:', dadosEntrada);
    this.http.post(this.apiUrl, dadosEntrada).subscribe({
      next: () => {
        alert('Entrada cadastrada com sucesso!');
        this.limparFormulario();
        this.listarEntradas();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar entrada:', erro);
        alert('Erro ao cadastrar entrada. Verifique o console e o backend.');
      }
    });
  }

  limparFormulario(): void {
    this.novaEntrada = {
      iditem: null,
      dataEntradaProduto: '',
      quantidadeEntrada: 0,
      valorUnitarioEntrada: 0
    };
  }
}
