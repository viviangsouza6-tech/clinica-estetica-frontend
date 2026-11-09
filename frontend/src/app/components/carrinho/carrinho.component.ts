
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {

  itensDisponiveis: Item[] = [];
  carrinho: ItemCarrinho[] = [];

  private api = 'https://localhost:7061/api/Item';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarItens();
    this.carregarCarrinho();
  }

  carregarItens(): void {
    this.http.get<Item[]>(this.api).subscribe({
      next: (dados) => {
        this.itensDisponiveis = dados.filter(
          item => item.ativoProdutoServico === 'S'
        );
      },
      error: (erro) => {
        console.error('Erro ao carregar itens:', erro);
        alert('Não foi possível carregar os produtos e serviços.');
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
      produto => produto.iditem === item.iditem
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

    alert(
      'Carrinho pronto! O próximo passo será integrar a finalização com o cadastro de pedidos do backend.'
    );
  }
}
