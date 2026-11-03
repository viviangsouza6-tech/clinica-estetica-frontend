
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent implements OnInit {

  produtos: any[] = [];

  novoProduto = {
    item1: '',
    descricaoItem: '',
    idcategoria: 0,
    preco: 0
  };

  private apiUrl = 'https://localhost:7061/api/Item';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.produtos = dados.filter(
          item => item.tipoItem === 'P'
        );
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos:', erro);
      }
    });
  }

  salvarProduto(): void {

    if (
      !this.novoProduto.item1.trim() ||
      !this.novoProduto.descricaoItem.trim() ||
      this.novoProduto.idcategoria === 0 ||
      this.novoProduto.preco <= 0
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const dadosProduto = {
      item1: this.novoProduto.item1,
      descricaoItem: this.novoProduto.descricaoItem,
      idcategoria: this.novoProduto.idcategoria,
      preco: this.novoProduto.preco,
      tipoItem: 'P',
      ativoProdutoServico: 'S'
    };

    this.http.post(this.apiUrl, dadosProduto).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');

        this.listarProdutos();

        this.novoProduto = {
          item1: '',
          descricaoItem: '',
          idcategoria: 0,
          preco: 0
        };
      },
      error: (erro) => {
        console.error('Erro ao cadastrar produto:', erro);
        alert('Erro ao cadastrar produto: ' + JSON.stringify(erro.error));
      }
    });
  }
}
