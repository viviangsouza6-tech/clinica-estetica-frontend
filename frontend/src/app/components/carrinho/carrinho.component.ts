
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Item {
  iditem: number;
  item1: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
}

interface ItemCarrinho {
  iditem: number;
  nome: string;
  preco: number;
  tipoItem: string;
  quantidade: number;
}

interface Cliente {
  idpessoa: number;
  nome: string;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {

  itensDisponiveis: Item[] = [];
  carrinho: ItemCarrinho[] = [];
  clientes: Cliente[] = [];

  clienteSelecionado: number | null = null;
  processandoPedido = false;

  private apiItem = 'https://localhost:7061/api/Item';
  private apiPedido = 'https://localhost:7061/api/Pedido';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarItens();
    this.carregarCarrinho();
    this.carregarClientes();
  }

  carregarItens(): void {
    this.http.get<Item[]>(this.apiItem).subscribe({
      next: (dados) => {
        this.itensDisponiveis = dados.filter(
          item => item.ativoProdutoServico === 'S'
        );
      },
      error: (erro) => {
        console.error('Erro ao carregar itens:', erro);
      }
    });
  }

  carregarClientes(): void {
    this.http.get<Cliente[]>(`${this.apiPedido}/clientes`).subscribe({
      next: (dados) => {
        console.log('CLIENTES RECEBIDOS:', dados);
        this.clientes = dados;
      },
      error: (erro) => {
        console.error('ERRO AO BUSCAR CLIENTES:', erro);
        alert('Não foi possível carregar os clientes.');
      }
    });
  }

  carregarCarrinho(): void {
    const dados = localStorage.getItem('carrinhoClinica');

    if (dados) {
      this.carrinho = JSON.parse(dados);
    }
  }

  salvarCarrinho(): void {
    localStorage.setItem(
      'carrinhoClinica',
      JSON.stringify(this.carrinho)
    );
  }

  adicionarItem(item: Item): void {
    const existente = this.carrinho.find(
      p => p.iditem === item.iditem
    );

    if (existente) {
      existente.quantidade++;
    } else {
      this.carrinho.push({
        iditem: item.iditem,
        nome: item.item1,
        preco: Number(item.preco),
        tipoItem: item.tipoItem,
        quantidade: 1
      });
    }

    this.salvarCarrinho();
    alert('Item adicionado ao carrinho!');
  }

  aumentarQuantidade(item: ItemCarrinho): void {
    item.quantidade++;
    this.salvarCarrinho();
  }

  diminuirQuantidade(item: ItemCarrinho): void {
    if (item.quantidade > 1) {
      item.quantidade--;
      this.salvarCarrinho();
    }
  }

  removerItem(id: number): void {
    this.carrinho = this.carrinho.filter(
      item => item.iditem !== id
    );

    this.salvarCarrinho();
  }

  getSubtotal(item: ItemCarrinho): number {
    return item.preco * item.quantidade;
  }

  get total(): number {
    return this.carrinho.reduce(
      (soma, item) => soma + this.getSubtotal(item),
      0
    );
  }

  get quantidadeItens(): number {
    return this.carrinho.reduce(
      (soma, item) => soma + item.quantidade,
      0
    );
  }

  confirmarPedido(): void {
    if (this.carrinho.length === 0) {
      alert('Adicione pelo menos um item ao carrinho.');
      return;
    }

    if (!this.clienteSelecionado) {
      alert('Selecione um cliente.');
      return;
    }

    const pedido = {
      idpessoa: this.clienteSelecionado,
      itens: this.carrinho.map(item => ({
        iditem: item.iditem,
        quantidade: item.quantidade
      }))
    };

    this.processandoPedido = true;

    this.http.post<any>(
      `${this.apiPedido}/confirmar`,
      pedido
    ).subscribe({
      next: (resposta) => {
        alert(
          `${resposta.mensagem}\nAtendimento: ${resposta.idatendimento}`
        );

        this.carrinho = [];
        this.clienteSelecionado = null;
        this.salvarCarrinho();
        this.processandoPedido = false;
      },
      error: (erro) => {
        console.error('Erro ao confirmar pedido:', erro);

        alert(
          erro.error?.mensagem ||
          erro.error ||
          'Erro ao finalizar pedido.'
        );

        this.processandoPedido = false;
      }
    });
  }
}
