import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];

  private apiUrl = 'https://localhost:7061/api/Pessoa';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.clientes = dados;
        console.log('Clientes:', dados);
      },
      error: (erro) => {
        console.error('Erro ao buscar clientes:', erro);
      }
    });
  }
}