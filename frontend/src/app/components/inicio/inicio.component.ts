
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  totalClientes = 0;
  totalProdutos = 0;
  totalServicos = 0;
  totalPedidos = 0;
  totalEstoque = 0;

  mensagemErro = '';

  private api = 'https://localhost:7061/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo(): void {

    // Total de clientes
    this.http.get<any[]>(`${this.api}/Pessoa`).subscribe({
      next: (dados) => {
        this.totalClientes = dados.length;
      },
      error: (erro) => {
        console.error('Erro ao carregar clientes:', erro);
        this.mensagemErro = 'Não foi possível carregar alguns dados.';
      }
    });

    // Total de produtos e serviços
    this.http.get<any[]>(`${this.api}/Item`).subscribe({
      next: (dados) => {
        this.totalProdutos = dados.filter(
          item => String(item.tipoItem).toUpperCase() === 'P'
        ).length;

        this.totalServicos = dados.filter(
          item => String(item.tipoItem).toUpperCase() === 'S'
        ).length;
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos e serviços:', erro);
        this.mensagemErro = 'Não foi possível carregar alguns dados.';
      }
    });

    // Total de pedidos
    this.http.get<any[]>(`${this.api}/Pedido`).subscribe({
      next: (dados) => {
        this.totalPedidos = dados.length;
      },
      error: (erro) => {
        console.error('Erro ao carregar pedidos:', erro);
        this.mensagemErro = 'Não foi possível carregar alguns dados.';
      }
    });

    // Quantidade total disponível no estoque
    this.http.get<any[]>(`${this.api}/Estoque`).subscribe({
      next: (dados) => {
        this.totalEstoque = dados.reduce(
          (total, item) => total + Number(item.quantidade || 0),
          0
        );
      },
      error: (erro) => {
        console.error('Erro ao carregar estoque:', erro);
        this.mensagemErro = 'Não foi possível carregar alguns dados.';
      }
    });
  }
}
