
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Estoque {
  iditem: number;
  item: string;
  descricao: string;
  preco: number;
  precoVenda: number;
  unidade: string;
  quantidade: number;
  situacao: string;
}

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.css'
})
export class EstoqueComponent implements OnInit {

  estoques: Estoque[] = [];
  estoquesFiltrados: Estoque[] = [];

  idConsulta: string = '';
  mensagem: string = '';

  idEditando: number | null = null;
  quantidadeEdicao: number = 0;

  private api = 'https://localhost:7061/api/Estoque';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarEstoque();
  }

  carregarEstoque(): void {
    this.http.get<Estoque[]>(this.api).subscribe({
      next: (dados) => {
        this.estoques = dados;
        this.estoquesFiltrados = dados;
        this.mensagem = '';
      },
      error: (erro) => {
        console.error('Erro ao carregar estoque:', erro);
        this.mensagem = 'Não foi possível carregar o estoque.';
      }
    });
  }

  // CONSULTAR ESTOQUE PELO ID
  consultarEstoque(): void {

    if (!this.idConsulta.trim()) {
      this.estoquesFiltrados = this.estoques;
      this.mensagem = 'Digite o ID do produto para consultar.';
      return;
    }

    const id = Number(this.idConsulta);

    if (!Number.isInteger(id) || id <= 0) {
      this.estoquesFiltrados = [];
      this.mensagem = 'Digite um ID válido.';
      return;
    }

    const encontrado = this.estoques.find(
      estoque => estoque.iditem === id
    );

    if (encontrado) {
      this.estoquesFiltrados = [encontrado];
      this.mensagem = '';
    } else {
      this.estoquesFiltrados = [];
      this.mensagem = 'Nenhum produto encontrado com esse ID.';
    }
  }

  // LIMPAR CONSULTA
  limparConsulta(): void {
    this.idConsulta = '';
    this.estoquesFiltrados = this.estoques;
    this.mensagem = '';
  }

  // EDITAR ESTOQUE
  editarEstoque(estoque: Estoque): void {
    this.idEditando = estoque.iditem;
    this.quantidadeEdicao = estoque.quantidade;
    this.mensagem = '';
  }

  // CANCELAR EDIÇÃO
  cancelarEdicao(): void {
    this.idEditando = null;
    this.quantidadeEdicao = 0;
    this.mensagem = '';
  }

  // SALVAR ALTERAÇÃO
  salvarEdicao(estoque: Estoque): void {

    if (
      !Number.isInteger(Number(this.quantidadeEdicao)) ||
      Number(this.quantidadeEdicao) < 0
    ) {
      this.mensagem = 'Informe uma quantidade inteira e não negativa.';
      return;
    }

    const dados = {
      quantidadeEstoque: Number(this.quantidadeEdicao)
    };

    this.http.put(`${this.api}/${estoque.iditem}`, dados).subscribe({
      next: () => {

        this.estoques = this.estoques.map(item =>
          item.iditem === estoque.iditem
            ? { ...item, quantidade: dados.quantidadeEstoque }
            : item
        );

        this.estoquesFiltrados = this.estoquesFiltrados.map(item =>
          item.iditem === estoque.iditem
            ? { ...item, quantidade: dados.quantidadeEstoque }
            : item
        );

        this.idEditando = null;
        this.quantidadeEdicao = 0;
        this.mensagem = 'Quantidade atualizada com sucesso!';
      },
      error: (erro) => {
        console.error('Erro ao atualizar estoque:', erro);
        this.mensagem = 'Não foi possível atualizar a quantidade.';
      }
    });
  }
}
