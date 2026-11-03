import { Routes } from '@angular/router';

import { InicioComponent } from './components/inicio/inicio.component';
import { ServicosComponent } from './components/servicos/servicos.component';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { EntradaProdutosComponent } from './components/entrada-produtos/entrada-produtos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'servicos', component: ServicosComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'estoque', component: EstoqueComponent },
  { path: 'entrada-produtos', component: EntradaProdutosComponent }
];