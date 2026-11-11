
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  pedidos: any[] = [];
  itensPedido: any[] = [];

  carregando = false;
  mostrarItens = false;
  pedidoSelecionado: any = null;

  private apiUrl = 'https://localhost:7061/api/Pedido';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarPedidos();
  }

  listarPedidos(): void {
    this.carregando = true;

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.pedidos = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar pedidos:', erro);
        this.carregando = false;
        alert('Não foi possível carregar os pedidos.');
      }
    });
  }

  verItens(pedido: any): void {
    this.pedidoSelecionado = pedido;
    this.itensPedido = [];
    this.mostrarItens = true;

    this.http.get<any[]>(
      `${this.apiUrl}/${pedido.idatendimento}/itens`
    ).subscribe({
      next: (dados) => {
        this.itensPedido = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar itens:', erro);
        alert('Não foi possível carregar os itens do pedido.');
      }
    });
  }

  fecharItens(): void {
    this.mostrarItens = false;
    this.pedidoSelecionado = null;
    this.itensPedido = [];
  }
}
