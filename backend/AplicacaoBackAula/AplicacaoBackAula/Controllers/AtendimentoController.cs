
using AplicacaoBackAula.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AplicacaoBackAula.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AtendimentoController : ControllerBase
{
    private readonly BdAulaBackendContext _context;

    public AtendimentoController(BdAulaBackendContext context)
    {
        _context = context;
    }

    // GET: api/Atendimento
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Atendimento>>> GetAtendimentos()
    {
        var atendimentos = await _context.Atendimentos.ToListAsync();

        return Ok(atendimentos);
    }

    // GET: api/Atendimento/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Atendimento>> GetAtendimento(int id)
    {
        var atendimento = await _context.Atendimentos.FindAsync(id);

        if (atendimento == null)
        {
            return NotFound();
        }

        return Ok(atendimento);
    }

    // POST: api/Atendimento
    [HttpPost]
    public async Task<ActionResult<Atendimento>> PostAtendimento(Atendimento dados)
    {
        var atendimento = new Atendimento
        {
            Idpessoa = dados.Idpessoa,
            DataAtendimento = dados.DataAtendimento,
            StatusAtendimento = dados.StatusAtendimento
        };

        _context.Atendimentos.Add(atendimento);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetAtendimento),
            new { id = atendimento.Idatendimento },
            atendimento
        );
    }
}
