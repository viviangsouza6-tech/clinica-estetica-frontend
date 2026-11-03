using AplicacaoBackAula.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AplicacaoBackAula.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly BdAulaBackendContext _context;

        public ItemController(BdAulaBackendContext context)
        {
            _context = context;
        }

        // GET: api/Item
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItens()
        {
            return await _context.Items.ToListAsync();
        }

        // GET: api/Item/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items
                .FirstOrDefaultAsync(i => i.Iditem == id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // POST: api/Item
        [HttpPost]
        public async Task<ActionResult<Item>> PostItem(Item item)
        {
            var categoriaExiste = await _context.Categoria
                .AnyAsync(c => c.Idcategoria == item.Idcategoria);

            if (!categoriaExiste)
            {
                return BadRequest("Categoria não encontrada.");
            }

            item.IdcategoriaNavigation = null;

            _context.Items.Add(item);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetItem),
                new { id = item.Iditem },
                item
            );
        }

        // PUT: api/Item/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, Item item)
        {
            if (id != item.Iditem)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExiste(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // DELETE: api/Item/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items
                .FirstOrDefaultAsync(i => i.Iditem == id);

            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemExiste(int id)
        {
            return _context.Items.Any(e => e.Iditem == id);
        }
    }
}