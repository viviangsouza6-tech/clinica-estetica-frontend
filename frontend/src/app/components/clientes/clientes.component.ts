
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];
  enderecos: any[] = [];

  idEdicao: number | null = null;
  idEnderecoEdicao: number | null = null;

  novoCliente = {
    nome: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    ativoPessoa: 'S',
    cep: '',
    numero: '',
    complemento: ''
  };

  private apiPessoa = 'https://localhost:7061/api/Pessoa';
  private apiEndereco = 'https://localhost:7061/api/Endereco';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    this.http.get<any[]>(this.apiPessoa).subscribe({
      next: (pessoas) => {
        this.http.get<any[]>(this.apiEndereco).subscribe({
          next: (enderecos) => {
            this.enderecos = enderecos;

            this.clientes = pessoas.map(pessoa => {
              const endereco = enderecos.find(
                e => e.idpessoa === pessoa.idpessoa
              );

              return {
                ...pessoa,
                cep: endereco?.cep || '',
                numero: endereco?.numero || '',
                complemento: endereco?.complemento || '',
                idendereco: endereco?.idendereco || null
              };
            });
          },
          error: (erro) => {
            console.error('Erro ao buscar endereços:', erro);
            alert('Erro ao carregar os endereços.');
          }
        });
      },
      error: (erro) => {
        console.error('Erro ao buscar clientes:', erro);
        alert('Erro ao carregar os clientes.');
      }
    });
  }

  salvarCliente(): void {
    if (
      !this.novoCliente.nome.trim() ||
      !this.novoCliente.dataNascimento ||
      !this.novoCliente.sexo ||
      !this.novoCliente.email.trim() ||
      !this.novoCliente.telefone.trim() ||
      !this.novoCliente.cep.trim() ||
      !this.novoCliente.numero.trim()
    ) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (
      this.novoCliente.sexo !== 'M' &&
      this.novoCliente.sexo !== 'F'
    ) {
      alert('Selecione M ou F no campo Sexo.');
      return;
    }

    const dadosPessoa: any = {
      nome: this.novoCliente.nome.trim(),
      dataNascimento: this.novoCliente.dataNascimento,
      sexo: this.novoCliente.sexo,
      email: this.novoCliente.email.trim(),
      telefone: Number(this.novoCliente.telefone),
      ativoPessoa: this.novoCliente.ativoPessoa
    };

    const criarEndereco = (idPessoa: number) => ({
      idpessoa: idPessoa,
      cep: this.novoCliente.cep.trim(),
      numero: this.novoCliente.numero.trim(),
      complemento: this.novoCliente.complemento.trim()
    });

    // CADASTRAR CLIENTE
    if (this.idEdicao === null) {
      this.http.post<any>(this.apiPessoa, dadosPessoa).subscribe({
        next: (pessoa) => {
          this.http.post(
            this.apiEndereco,
            criarEndereco(pessoa.idpessoa)
          ).subscribe({
            next: () => {
              alert('Cliente e endereço cadastrados com sucesso!');
              this.listarClientes();
              this.limparFormulario();
            },
            error: (erro) => {
              console.error('Erro ao cadastrar endereço:', erro);
              alert('A pessoa foi cadastrada, mas ocorreu um erro ao cadastrar o endereço.');
              this.listarClientes();
            }
          });
        },
        error: (erro) => {
          console.error('Erro ao cadastrar pessoa:', erro);
          alert('Erro ao cadastrar cliente: ' + JSON.stringify(erro.error));
        }
      });

      return;
    }

    // EDITAR CLIENTE
    dadosPessoa.idpessoa = this.idEdicao;

    this.http.put(
      `${this.apiPessoa}/${this.idEdicao}`,
      dadosPessoa
    ).subscribe({
      next: () => {
        const endereco = {
          ...criarEndereco(this.idEdicao!),
          idendereco: this.idEnderecoEdicao
        };

        if (this.idEnderecoEdicao !== null) {
          // Atualiza endereço existente
          this.http.put(
            `${this.apiEndereco}/${this.idEnderecoEdicao}`,
            endereco
          ).subscribe({
            next: () => {
              alert('Cliente e endereço atualizados com sucesso!');
              this.listarClientes();
              this.limparFormulario();
            },
            error: (erro) => {
              console.error('Erro ao atualizar endereço:', erro);
              alert('Cliente atualizado, mas ocorreu um erro ao atualizar o endereço.');
            }
          });
        } else {
          // Cadastra endereço caso ainda não exista
          this.http.post(
            this.apiEndereco,
            criarEndereco(this.idEdicao!)
          ).subscribe({
            next: () => {
              alert('Cliente e endereço atualizados com sucesso!');
              this.listarClientes();
              this.limparFormulario();
            },
            error: (erro) => {
              console.error('Erro ao cadastrar endereço:', erro);
              alert('Cliente atualizado, mas ocorreu um erro ao cadastrar o endereço.');
            }
          });
        }
      },
      error: (erro) => {
        console.error('Erro ao atualizar cliente:', erro);
        alert('Erro ao atualizar cliente: ' + JSON.stringify(erro.error));
      }
    });
  }

  // CARREGAR DADOS NO FORMULÁRIO PARA EDITAR
  editarCliente(cliente: any): void {
    this.idEdicao = cliente.idpessoa;
    this.idEnderecoEdicao = cliente.idendereco;

    this.novoCliente = {
      nome: cliente.nome || '',
      dataNascimento: cliente.dataNascimento
        ? String(cliente.dataNascimento).substring(0, 10)
        : '',
      sexo: cliente.sexo || '',
      email: cliente.email || '',
      telefone: String(cliente.telefone || ''),
      ativoPessoa: cliente.ativoPessoa || 'S',
      cep: cliente.cep || '',
      numero: cliente.numero || '',
      complemento: cliente.complemento || ''
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // EXCLUIR CLIENTE E ENDEREÇO
  excluirCliente(id: number): void {
    const confirmar = confirm(
      'Tem certeza que deseja excluir este cliente e seu endereço?'
    );

    if (!confirmar) {
      return;
    }

    const endereco = this.enderecos.find(
      e => e.idpessoa === id
    );

    if (endereco) {
      this.http.delete(
        `${this.apiEndereco}/${endereco.idendereco}`
      ).subscribe({
        next: () => this.excluirPessoa(id),
        error: (erro) => {
          console.error('Erro ao excluir endereço:', erro);
          alert('Não foi possível excluir o endereço.');
        }
      });
    } else {
      this.excluirPessoa(id);
    }
  }

  excluirPessoa(id: number): void {
    this.http.delete(
      `${this.apiPessoa}/${id}`
    ).subscribe({
      next: () => {
        alert('Cliente excluído com sucesso!');
        this.listarClientes();

        if (this.idEdicao === id) {
          this.limparFormulario();
        }
      },
      error: (erro) => {
        console.error('Erro ao excluir pessoa:', erro);
        alert('Não foi possível excluir o cliente. Verifique se existem pedidos ou atendimentos vinculados.');
        this.listarClientes();
      }
    });
  }

  // LIMPAR FORMULÁRIO
  limparFormulario(): void {
    this.idEdicao = null;
    this.idEnderecoEdicao = null;

    this.novoCliente = {
      nome: '',
      dataNascimento: '',
      sexo: '',
      email: '',
      telefone: '',
      ativoPessoa: 'S',
      cep: '',
      numero: '',
      complemento: ''
    };
  }
}
