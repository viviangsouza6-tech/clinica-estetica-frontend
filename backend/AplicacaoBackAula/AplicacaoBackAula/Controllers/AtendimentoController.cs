using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AplicacaoBackAula.Models;
using AplicacaoBackAula.DTO;

namespace AplicacaoBackAula.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AtendimentoController : ControllerBase
    {
        private readonly BdAulaBackendContext _context;

        public AtendimentoController(BdAulaBackendContext context)
        {
            _context = context;
        }

        // ==========================================
        // GET - LISTAR TODOS OS ATENDIMENTOS
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AtendimentoDTO>>> GetAtendimentos()
        {
            var atendimentos = await _context.Atendimentos
                .Include(a => a.Atendimentoitems)
                .ToListAsync();

            var resultado = atendimentos.Select(a => new AtendimentoDTO
            {
                Idatendimento = a.Idatendimento,
                Idpessoa = a.Idpessoa,
                DataAtendimento = a.DataAtendimento,
                StatusAtendimento = a.StatusAtendimento,

                Itens = a.Atendimentoitems.Select(ai => new AtendimentoItemDTO
                {
                    Iditem = ai.Iditem,
                    Idfuncionario = ai.Idfuncionario,
                    QuantidadeItens = ai.QuantidadeItens,
                    ValorunitarioEntrada = ai.ValorunitarioEntrada
                }).ToList()

            }).ToList();

            return Ok(resultado);
        }

        // ==========================================
        // GET - BUSCAR ATENDIMENTO PELO ID
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<AtendimentoDTO>> GetAtendimento(int id)
        {
            var atendimento = await _context.Atendimentos
                .Include(a => a.Atendimentoitems)
                .FirstOrDefaultAsync(a => a.Idatendimento == id);

            if (atendimento == null)
            {
                return NotFound(new
                {
                    mensagem = "Atendimento não localizado"
                });
            }

            var resultado = new AtendimentoDTO
            {
                Idatendimento = atendimento.Idatendimento,
                Idpessoa = atendimento.Idpessoa,
                DataAtendimento = atendimento.DataAtendimento,
                StatusAtendimento = atendimento.StatusAtendimento,

                Itens = atendimento.Atendimentoitems
                    .Select(ai => new AtendimentoItemDTO
                    {
                        Iditem = ai.Iditem,
                        Idfuncionario = ai.Idfuncionario,
                        QuantidadeItens = ai.QuantidadeItens,
                        ValorunitarioEntrada = ai.ValorunitarioEntrada
                    }).ToList()
            };

            return Ok(resultado);
        }

        // ==========================================
        // POST - CADASTRAR ATENDIMENTO
        // ==========================================
        [HttpPost]
        public async Task<ActionResult<AtendimentoDTO>> PostAtendimento(
            AtendimentoDTO dados)
        {
            var pessoa = await _context.Pessoas
                .FirstOrDefaultAsync(p => p.Idpessoa == dados.Idpessoa);

            if (pessoa == null)
            {
                return NotFound(new
                {
                    mensagem = "Pessoa não localizada"
                });
            }

            var atendimento = new Atendimento
            {
                Idatendimento = dados.Idatendimento,
                Idpessoa = dados.Idpessoa,
                DataAtendimento = dados.DataAtendimento,
                StatusAtendimento = dados.StatusAtendimento!
            };

            _context.Atendimentos.Add(atendimento);

            await _context.SaveChangesAsync();

            foreach (var itemDTO in dados.Itens)
            {
                var item = await _context.Items
                    .FirstOrDefaultAsync(i =>
                        i.Iditem == itemDTO.Iditem);

                if (item == null)
                {
                    return NotFound(new
                    {
                        mensagem = $"Item {itemDTO.Iditem} não localizado"
                    });
                }

                var funcionario = await _context.Funcionarios
                    .FirstOrDefaultAsync(f =>
                        f.Idpessoa == itemDTO.Idfuncionario);

                if (funcionario == null)
                {
                    return NotFound(new
                    {
                        mensagem =
                            $"Funcionário {itemDTO.Idfuncionario} não localizado"
                    });
                }

                var atendimentoItem = new Atendimentoitem
                {
                    Idatendimento = atendimento.Idatendimento,
                    Iditem = itemDTO.Iditem,
                    Idfuncionario = itemDTO.Idfuncionario,
                    QuantidadeItens = itemDTO.QuantidadeItens,
                    ValorunitarioEntrada = itemDTO.ValorunitarioEntrada
                };

                _context.Atendimentoitems.Add(atendimentoItem);
            }

            await _context.SaveChangesAsync();

            dados.Idatendimento = atendimento.Idatendimento;

            return CreatedAtAction(
                nameof(GetAtendimento),
                new { id = atendimento.Idatendimento },
                dados
            );
        }

        // ==========================================
        // PUT - ATUALIZAR ATENDIMENTO
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAtendimento(
            int id,
            AtendimentoDTO dados)
        {
            var atendimento = await _context.Atendimentos
                .FirstOrDefaultAsync(a =>
                    a.Idatendimento == id);

            if (atendimento == null)
            {
                return NotFound(new
                {
                    mensagem = "Atendimento não localizado"
                });
            }

            atendimento.Idpessoa = dados.Idpessoa;
            atendimento.DataAtendimento = dados.DataAtendimento;
            atendimento.StatusAtendimento = dados.StatusAtendimento!;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensagem = "Atendimento atualizado com sucesso"
            });
        }

        // ==========================================
        // DELETE - EXCLUIR ATENDIMENTO
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAtendimento(int id)
        {
            var atendimento = await _context.Atendimentos
                .Include(a => a.Atendimentoitems)
                .FirstOrDefaultAsync(a =>
                    a.Idatendimento == id);

            if (atendimento == null)
            {
                return NotFound(new
                {
                    mensagem = "Atendimento não localizado"
                });
            }

            _context.Atendimentoitems.RemoveRange(
                atendimento.Atendimentoitems
            );

            _context.Atendimentos.Remove(atendimento);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensagem = "Atendimento excluído com sucesso"
            });
        }
    }
}