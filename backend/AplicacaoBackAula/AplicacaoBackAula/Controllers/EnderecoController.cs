using AplicacaoBackAula.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class EnderecoController : ControllerBase
{
    private readonly BdAulaBackendContext _context;

    public EnderecoController(BdAulaBackendContext context)
    {
        _context = context;
    }

    // GET: api/Endereco
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Endereco>>> GetEnderecos()
    {
        return await _context.Enderecos.ToListAsync();
    }

    // GET: api/Endereco/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Endereco>> GetEndereco(int id)
    {
        var endereco = await _context.Enderecos
            .FirstOrDefaultAsync(e => e.Idendereco == id);

        if (endereco == null)
        {
            return NotFound();
        }

        return endereco;
    }

    // POST: api/Endereco
    [HttpPost]
    public async Task<ActionResult<Endereco>> PostEndereco(Endereco endereco)
    {
        var pessoaExiste = await _context.Pessoas
            .AnyAsync(p => p.Idpessoa == endereco.Idpessoa);

        if (!pessoaExiste)
        {
            return BadRequest("Pessoa não encontrada.");
        }

        endereco.IdpessoaNavigation = null;

        _context.Enderecos.Add(endereco);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetEndereco),
            new { id = endereco.Idendereco },
            endereco
        );
    }

    // PUT: api/Endereco/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEndereco(int id, Endereco endereco)
    {
        if (id != endereco.Idendereco)
        {
            return BadRequest();
        }

        var pessoaExiste = await _context.Pessoas
            .AnyAsync(p => p.Idpessoa == endereco.Idpessoa);

        if (!pessoaExiste)
        {
            return BadRequest("Pessoa não encontrada.");
        }

        endereco.IdpessoaNavigation = null;

        _context.Entry(endereco).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EnderecoExiste(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    // DELETE: api/Endereco/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEndereco(int id)
    {
        var endereco = await _context.Enderecos
            .FirstOrDefaultAsync(e => e.Idendereco == id);

        if (endereco == null)
        {
            return NotFound();
        }

        _context.Enderecos.Remove(endereco);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool EnderecoExiste(int id)
    {
        return _context.Enderecos
            .Any(e => e.Idendereco == id);
    }
}