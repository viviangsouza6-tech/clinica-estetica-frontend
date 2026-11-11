
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

  salvando = false;

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
        console.log('Entradas carregadas:', dados);
      },
      error: (erro) => {
        console.error('Erro ao carregar entradas:', erro);
        alert('Erro ao carregar entradas. Status: ' + erro.status);
      }
    });
  }

  listarProdutos(): void {
    this.http.get<any[]>(this.itemUrl).subscribe({
      next: (dados) => {
        this.todosItens = dados;

        this.produtosDisponiveis = dados.filter(item =>
          item.tipoItem?.trim().toUpperCase() === 'P' &&
          item.ativoProdutoServico?.trim().toUpperCase() === 'S'
        );

        console.log('Produtos disponíveis:', this.produtosDisponiveis);
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
        alert('Erro ao carregar produtos. Status: ' + erro.status);
      }
    });
  }

  nomeProduto(iditem: number): string {
    const produto = this.todosItens.find(
      item => Number(item.iditem) === Number(iditem)
    );

    return produto ? produto.item1 : 'Produto não encontrado';
  }

  salvarEntrada(): void {
    console.log('Botão Salvar Entrada acionado!');

    if (this.salvando) {
      return;
    }

    if (
      !this.novaEntrada.iditem ||
      !this.novaEntrada.dataEntradaProduto ||
      Number(this.novaEntrada.quantidadeEntrada) <= 0 ||
      Number(this.novaEntrada.valorUnitarioEntrada) <= 0
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const dadosEntrada = {
      iditem: Number(this.novaEntrada.iditem),
      dataEntradaProduto: this.novaEntrada.dataEntradaProduto,
      quantidadeEntrada: Number(this.novaEntrada.quantidadeEntrada),
      unidade: 'UN',
      valorUnitarioEntrada: Number(this.novaEntrada.valorUnitarioEntrada)
    };

    console.log('Dados enviados para a API:', dadosEntrada);

    this.salvando = true;

    this.http.post(this.apiUrl, dadosEntrada).subscribe({
      next: (resposta) => {
        console.log('Entrada cadastrada:', resposta);

        alert('Entrada cadastrada com sucesso!');

        this.limparFormulario();
        this.listarEntradas();

        this.salvando = false;
      },
      error: (erro) => {
        console.error('Erro ao cadastrar entrada:', erro);
        console.error('Detalhes do erro:', erro.error);

        alert(
          'Erro ao cadastrar entrada.\n' +
          'Status: ' + erro.status +
          '\nDetalhes: ' + JSON.stringify(erro.error)
        );

        this.salvando = false;
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
