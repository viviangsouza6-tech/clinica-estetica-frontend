
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.css'
})
export class ServicosComponent implements OnInit {

  private api = 'https://localhost:7061/api/Item';
  private apiCategoria = 'https://localhost:7061/api/Categorium';

  servicos: any[] = [];
  servicosFiltrados: any[] = [];
  categorias: any[] = [];

  pesquisa = '';
  mensagem = '';

  mostrarFormulario = false;
  idEmEdicao: number | null = null;

  formServico = {
    idcategoria: 0,
    item1: '',
    descricaoItem: '',
    preco: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarServicos();
    this.listarCategorias();
  }

  listarServicos(): void {
    this.http.get<any[]>(this.api).subscribe({
      next: (dados) => {
        this.servicos = dados.filter(item => item.tipoItem === 'S');
        this.pesquisarServico();
      },
      error: (erro) => {
        console.error('Erro ao buscar serviços:', erro);
        this.mensagem = 'Não foi possível carregar os serviços.';
      }
    });
  }

  listarCategorias(): void {
    this.http.get<any[]>(this.apiCategoria).subscribe({
      next: (dados) => {
        this.categorias = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar categorias:', erro);
        this.mensagem = 'Não foi possível carregar as categorias.';
      }
    });
  }

  pesquisarServico(): void {
    const termo = this.pesquisa.toLowerCase();

    this.servicosFiltrados = this.servicos.filter(servico =>
      servico.item1.toLowerCase().includes(termo)
    );
  }

  novoServico(): void {
    this.idEmEdicao = null;

    this.formServico = {
      idcategoria: 0,
      item1: '',
      descricaoItem: '',
      preco: 0
    };

    this.mensagem = '';
    this.mostrarFormulario = true;
  }

  editarServico(servico: any): void {
    this.idEmEdicao = servico.iditem;

    this.formServico = {
      idcategoria: servico.idcategoria,
      item1: servico.item1,
      descricaoItem: servico.descricaoItem,
      preco: servico.preco
    };

    this.mensagem = '';
    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.idEmEdicao = null;
    this.mensagem = '';
  }

  salvarServico(): void {

    if (
      this.formServico.idcategoria === 0 ||
      !this.formServico.item1.trim() ||
      !this.formServico.descricaoItem.trim() ||
      this.formServico.preco <= 0
    ) {
      this.mensagem = 'Preencha todos os campos corretamente!';
      return;
    }

    const dados = {
      iditem: this.idEmEdicao ?? 0,
      idcategoria: Number(this.formServico.idcategoria),
      item1: this.formServico.item1,
      descricaoItem: this.formServico.descricaoItem,
      preco: Number(this.formServico.preco),
      tipoItem: 'S',
      ativoProdutoServico: 'S'
    };

    if (this.idEmEdicao !== null) {

      this.http.put(`${this.api}/${this.idEmEdicao}`, dados).subscribe({
        next: () => {
          this.mensagem = 'Serviço atualizado com sucesso!';
          this.mostrarFormulario = false;
          this.idEmEdicao = null;
          this.listarServicos();
        },
        error: (erro) => {
          console.error('Erro ao editar serviço:', erro);
          this.mensagem = 'Erro ao atualizar serviço.';
        }
      });

    } else {

      this.http.post(this.api, dados).subscribe({
        next: () => {
          this.mensagem = 'Serviço cadastrado com sucesso!';
          this.mostrarFormulario = false;
          this.listarServicos();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar serviço:', erro);
          this.mensagem = 'Erro ao cadastrar serviço.';
        }
      });
    }
  }

  desativarServico(servico: any): void {

    if (!confirm(`Deseja desativar o serviço ${servico.item1}?`)) {
      return;
    }

    const dados = {
      iditem: servico.iditem,
      idcategoria: servico.idcategoria,
      item1: servico.item1,
      descricaoItem: servico.descricaoItem,
      preco: servico.preco,
      tipoItem: 'S',
      ativoProdutoServico: 'N'
    };

    this.http.put(`${this.api}/${servico.iditem}`, dados).subscribe({
      next: () => {
        this.mensagem = 'Serviço desativado com sucesso!';
        this.listarServicos();
      },
      error: (erro) => {
        console.error('Erro ao desativar serviço:', erro);
        this.mensagem = 'Erro ao desativar serviço.';
      }
    });
  }
}
