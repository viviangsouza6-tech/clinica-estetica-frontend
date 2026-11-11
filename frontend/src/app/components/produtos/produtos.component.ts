
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
  categorias: any[] = [];

  idEditando: number | null = null;

  apiUrl = 'https://localhost:7061/api/Item';
  categoriaUrl = 'https://localhost:7061/api/Categorium';

  situacaoProduto = 'S';

  novoProduto: any = {
    item1: '',
    descricaoItem: '',
    idcategoria: null,
    preco: null
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarProdutos();
    this.listarCategorias();
  }

  // LISTAR CATEGORIAS
  listarCategorias(): void {
    this.http.get<any[]>(this.categoriaUrl).subscribe({
      next: (dados) => {
        this.categorias = dados;
        console.log('Categorias carregadas:', dados);
      },
      error: (erro) => {
        console.error('Erro ao carregar categorias:', erro);
        alert('Não foi possível carregar as categorias.');
      }
    });
  }

  // LISTAR PRODUTOS
  listarProdutos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        console.log('Produtos carregados:', dados);

        this.produtos = dados.filter(item =>
          item.tipoItem?.trim().toUpperCase() === 'P' &&
          item.ativoProdutoServico?.trim().toUpperCase() === 'S'
        );
      },
      error: (erro) => {
        console.error('Erro ao listar produtos:', erro);
        alert('Não foi possível carregar os produtos.');
      }
    });
  }

  // CADASTRAR E EDITAR PRODUTO
  salvarProduto(): void {

    if (
      !this.novoProduto.item1?.trim() ||
      this.novoProduto.idcategoria == null ||
      this.novoProduto.preco == null ||
      Number(this.novoProduto.preco) <= 0
    ) {
      alert('Preencha os campos obrigatórios corretamente.');
      return;
    }

    const dadosProduto = {
      iditem: this.idEditando ?? 0,
      item1: this.novoProduto.item1.trim(),
      descricaoItem: this.novoProduto.descricaoItem,
      idcategoria: Number(this.novoProduto.idcategoria),
      preco: Number(this.novoProduto.preco),
      tipoItem: 'P',
      ativoProdutoServico: this.situacaoProduto
    };

    if (this.idEditando !== null) {

      this.http.put(
        `${this.apiUrl}/${this.idEditando}`,
        dadosProduto
      ).subscribe({
        next: () => {
          alert('Produto atualizado com sucesso!');
          this.limparFormulario();
          this.listarProdutos();
        },
        error: (erro) => {
          console.error('Erro ao atualizar produto:', erro);
          console.log(
            'Detalhes da API:',
            JSON.stringify(erro.error, null, 2)
          );

          alert(
            'Erro ao atualizar produto:\n' +
            JSON.stringify(erro.error, null, 2)
          );
        }
      });

    } else {

      this.http.post(this.apiUrl, dadosProduto).subscribe({
        next: (resposta) => {
          console.log('Produto cadastrado:', resposta);

          alert('Produto cadastrado com sucesso!');

          this.limparFormulario();
          this.listarProdutos();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar produto:', erro);

          console.log(
            'DETALHES DA API:',
            JSON.stringify(erro.error, null, 2)
          );

          alert(
            'Erro ao cadastrar produto:\n' +
            JSON.stringify(erro.error, null, 2)
          );
        }
      });

    }
  }

  // EDITAR PRODUTO
  editarProduto(produto: any): void {

    this.idEditando = produto.iditem;

    this.novoProduto = {
      item1: produto.item1,
      descricaoItem: produto.descricaoItem,
      idcategoria: produto.idcategoria,
      preco: produto.preco
    };

    this.situacaoProduto = produto.ativoProdutoServico;
  }

  // EXCLUIR PRODUTO
  excluirProduto(produto: any): void {

    const id = Number(produto.iditem);

    console.log('1 - Produto selecionado:', produto);
    console.log('2 - ID do produto:', id);

    if (!id) {
      alert('ID do produto inválido!');
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({

      next: (resposta) => {

        console.log('3 - DELETE realizado:', resposta);

        this.produtos = this.produtos.filter(
          p => Number(p.iditem) !== id
        );

        alert('Produto excluído com sucesso!');
      },

      error: (erro) => {

        console.error('3 - ERRO NO DELETE:', erro);

        alert(
          'Erro ao excluir produto.\n' +
          'Status: ' + erro.status +
          '\nDetalhes: ' +
          JSON.stringify(erro.error, null, 2)
        );
      }

    });
  }

  // LIMPAR FORMULÁRIO
  limparFormulario(): void {

    this.idEditando = null;
    this.situacaoProduto = 'S';

    this.novoProduto = {
      item1: '',
      descricaoItem: '',
      idcategoria: null,
      preco: null
    };
  }

  // CANCELAR EDIÇÃO
  cancelarEdicao(): void {
    this.limparFormulario();
  }
}
