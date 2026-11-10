
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {

  api = 'https://localhost:7061/api/Categorium';

  categorias: any[] = [];
  categoriasFiltradas: any[] = [];

  nomeCategoria = '';
  pesquisa = '';

  idEdicao: number | null = null;
  mostrarFormulario = false;
  mensagem = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.http.get<any[]>(this.api).subscribe({
      next: (dados) => {
        this.categorias = dados;
        this.pesquisarCategoria();
      },
      error: (erro) => {
        console.error('Erro ao carregar categorias:', erro);
        this.mensagem = 'Erro ao carregar as categorias.';
      }
    });
  }

  pesquisarCategoria(): void {
    const termo = this.pesquisa.toLowerCase();

    this.categoriasFiltradas = this.categorias.filter(c =>
      c.categoria?.toLowerCase().includes(termo)
    );
  }

  novaCategoria(): void {
    this.idEdicao = null;
    this.nomeCategoria = '';
    this.mensagem = '';
    this.mostrarFormulario = true;
  }

  editarCategoria(categoria: any): void {
    this.idEdicao = categoria.idcategoria;
    this.nomeCategoria = categoria.categoria;
    this.mensagem = '';
    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.idEdicao = null;
    this.nomeCategoria = '';
    this.mensagem = '';
  }

  salvarCategoria(): void {
    if (!this.nomeCategoria.trim()) {
      this.mensagem = 'Informe o nome da categoria.';
      return;
    }

    if (this.idEdicao === null) {

      const dados = {
        categoria: this.nomeCategoria.trim()
      };

      this.http.post(this.api, dados).subscribe({
        next: () => {
          this.mensagem = 'Categoria cadastrada com sucesso!';
          this.cancelarFormulario();
          this.listarCategorias();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar:', erro);
          console.error('Detalhes:', erro.error);
          this.mensagem = 'Erro ao cadastrar categoria.';
        }
      });

    } else {

      const dadosEdicao = {
        idcategoria: this.idEdicao,
        categoria: this.nomeCategoria.trim()
      };

      this.http.put(`${this.api}/${this.idEdicao}`, dadosEdicao).subscribe({
        next: () => {
          this.mensagem = 'Categoria atualizada com sucesso!';
          this.cancelarFormulario();
          this.listarCategorias();
        },
        error: (erro) => {
          console.error('Erro ao atualizar:', erro);
          this.mensagem = 'Erro ao atualizar categoria.';
        }
      });
    }
  }

  excluirCategoria(id: number): void {
    if (!confirm('Deseja realmente excluir esta categoria?')) {
      return;
    }

    this.http.delete(`${this.api}/${id}`).subscribe({
      next: () => {
        this.mensagem = 'Categoria excluída com sucesso!';
        this.listarCategorias();
      },
      error: (erro) => {
        console.error('Erro ao excluir:', erro);
        this.mensagem = 'Não foi possível excluir. Verifique se existem itens vinculados a esta categoria.';
      }
    });
  }
}
