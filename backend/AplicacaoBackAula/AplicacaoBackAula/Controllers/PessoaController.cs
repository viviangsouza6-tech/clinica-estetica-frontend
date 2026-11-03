using AplicacaoBackAula.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class PessoaController : ControllerBase
{
    private readonly BdAulaBackendContext _context;

    public PessoaController(BdAulaBackendContext context)
    {
        _context = context;
    }

    // GET: api/Pessoa
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
    {
        return await _context.Pessoas.ToListAsync();
    }

    // GET: api/Pessoa/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Pessoa>> GetPessoa(int id)
    {
        var pessoa = await _context.Pessoas
            .FirstOrDefaultAsync(p => p.Idpessoa == id);

        if (pessoa == null)
        {
            return NotFound();
        }

        return pessoa;
    }

    // POST: api/Pessoa
    [HttpPost]
    public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetPessoa),
            new { id = pessoa.Idpessoa },
            pessoa
        );
    }

    // PUT: api/Pessoa/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPessoa(
        int id,
        Pessoa pessoa)
    {
        if (id != pessoa.Idpessoa)
        {
            return BadRequest();
        }

        _context.Entry(pessoa).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PessoaExiste(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    // DELETE: api/Pessoa/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePessoa(int id)
    {
        var pessoa = await _context.Pessoas
            .FirstOrDefaultAsync(p => p.Idpessoa == id);

        if (pessoa == null)
        {
            return NotFound();
        }

        _context.Pessoas.Remove(pessoa);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PessoaExiste(int id)
    {
        return _context.Pessoas
            .Any(p => p.Idpessoa == id);
    }
}