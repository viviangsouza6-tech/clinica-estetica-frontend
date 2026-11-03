using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AplicacaoBackAula.Models;
using AplicacaoBackAula.DTO;

namespace AplicacaoBackAula.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntradaProdutoController : ControllerBase
    {
        private readonly BdAulaBackendContext _context;

        public EntradaProdutoController(BdAulaBackendContext context)
        {
            _context = context;
        }

        // ==========================================
        // GET - LISTAR TODAS AS ENTRADAS
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EntradaProdutoDTO>>> GetEntradas()
        {
            var entradas = await _context.EntradaProdutos
                .ToListAsync();

            var resultado = entradas.Select(e => new EntradaProdutoDTO
            {
                IdentradaProduto = e.IdentradaProduto,
                Iditem = e.Iditem,
                DataEntradaProduto = e.DataEntradaProduto,
                QuantidadeEntrada = e.QuantidadeEntrada,
                Unidade = e.Unidade,
                ValorUnitarioEntrada = e.ValorUnitarioEntrada
            }).ToList();

            return Ok(resultado);
        }

        // ==========================================
        // GET - BUSCAR ENTRADA PELO ID
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<EntradaProdutoDTO>> GetEntrada(int id)
        {
            var entrada = await _context.EntradaProdutos
                .FirstOrDefaultAsync(e => e.IdentradaProduto == id);

            if (entrada == null)
            {
                return NotFound(new
                {
                    mensagem = "Entrada de produto não localizada"
                });
            }

            var resultado = new EntradaProdutoDTO
            {
                IdentradaProduto = entrada.IdentradaProduto,
                Iditem = entrada.Iditem,
                DataEntradaProduto = entrada.DataEntradaProduto,
                QuantidadeEntrada = entrada.QuantidadeEntrada,
                Unidade = entrada.Unidade,
                ValorUnitarioEntrada = entrada.ValorUnitarioEntrada
            };

            return Ok(resultado);
        }

        // ==========================================
        // POST - CADASTRAR ENTRADA DE PRODUTO
        // ==========================================
        [HttpPost]
        public async Task<ActionResult<EntradaProdutoDTO>> PostEntrada(
            EntradaProdutoDTO dados)
        {
            var estoque = await _context.Estoques
                .FirstOrDefaultAsync(e => e.Iditem == dados.Iditem);

            if (estoque == null)
            {
                return NotFound(new
                {
                    mensagem = "Produto/estoque não localizado"
                });
            }

            var entrada = new EntradaProduto
            {
                Iditem = dados.Iditem,
                DataEntradaProduto = dados.DataEntradaProduto,
                QuantidadeEntrada = dados.QuantidadeEntrada,
                Unidade = dados.Unidade!,
                ValorUnitarioEntrada = dados.ValorUnitarioEntrada
            };

            _context.EntradaProdutos.Add(entrada);

            // A trigger do banco atualiza o estoque
            // e o valor do produto no INSERT.
            await _context.SaveChangesAsync();

            dados.IdentradaProduto = entrada.IdentradaProduto;

            return CreatedAtAction(
                nameof(GetEntrada),
                new { id = entrada.IdentradaProduto },
                dados
            );
        }

        // ==========================================
        // PUT - ATUALIZAR ENTRADA DE PRODUTO
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntrada(
            int id,
            EntradaProdutoDTO dados)
        {
            await using var transacao =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var entrada = await _context.EntradaProdutos
                    .FirstOrDefaultAsync(e => e.IdentradaProduto == id);

                if (entrada == null)
                {
                    return NotFound(new
                    {
                        mensagem = "Entrada de produto não localizada"
                    });
                }

                var estoque = await _context.Estoques
                    .FirstOrDefaultAsync(e => e.Iditem == entrada.Iditem);

                if (estoque == null)
                {
                    return NotFound(new
                    {
                        mensagem = "Estoque não localizado"
                    });
                }

                // Guarda a quantidade antiga antes de alterar.
                var quantidadeAntiga = entrada.QuantidadeEntrada;

                // Calcula a diferença entre a quantidade nova e a antiga.
                var diferenca =
                    dados.QuantidadeEntrada - quantidadeAntiga;

                // Atualiza a entrada.
                entrada.DataEntradaProduto =
                    dados.DataEntradaProduto;

                entrada.QuantidadeEntrada =
                    dados.QuantidadeEntrada;

                entrada.Unidade =
                    dados.Unidade!;

                entrada.ValorUnitarioEntrada =
                    dados.ValorUnitarioEntrada;

                // Atualiza somente a diferença no estoque.
                estoque.QuantidadeEstoque += (int)diferenca;

                if (estoque.QuantidadeEstoque < 0)
                {
                    await transacao.RollbackAsync();

                    return BadRequest(new
                    {
                        mensagem = "A alteração deixaria o estoque negativo"
                    });
                }

                await _context.SaveChangesAsync();
                await transacao.CommitAsync();

                return Ok(new
                {
                    mensagem = "Entrada de produto atualizada com sucesso"
                });
            }
            catch
            {
                await transacao.RollbackAsync();
                throw;
            }
        }

        // ==========================================
        // DELETE - EXCLUIR ENTRADA DE PRODUTO
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntrada(int id)
        {
            await using var transacao =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var entrada = await _context.EntradaProdutos
                    .FirstOrDefaultAsync(e => e.IdentradaProduto == id);

                if (entrada == null)
                {
                    return NotFound(new
                    {
                        mensagem = "Entrada de produto não localizada"
                    });
                }

                var estoque = await _context.Estoques
                    .FirstOrDefaultAsync(e => e.Iditem == entrada.Iditem);

                if (estoque == null)
                {
                    return NotFound(new
                    {
                        mensagem = "Estoque não localizado"
                    });
                }

                // Ao excluir uma entrada, retira do estoque
                // a quantidade que entrou por ela.
                estoque.QuantidadeEstoque -=
                    (int)entrada.QuantidadeEntrada;

                if (estoque.QuantidadeEstoque < 0)
                {
                    await transacao.RollbackAsync();

                    return BadRequest(new
                    {
                        mensagem = "A exclusão deixaria o estoque negativo"
                    });
                }

                _context.EntradaProdutos.Remove(entrada);

                await _context.SaveChangesAsync();
                await transacao.CommitAsync();

                return Ok(new
                {
                    mensagem = "Entrada de produto excluída com sucesso"
                });
            }
            catch
            {
                await transacao.RollbackAsync();
                throw;
            }
        }
    }
}