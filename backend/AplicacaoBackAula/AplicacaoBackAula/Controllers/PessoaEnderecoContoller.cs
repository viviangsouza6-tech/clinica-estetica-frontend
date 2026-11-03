using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AplicacaoBackAula.DTO;
using AplicacaoBackAula.Models;

namespace AplicacaoBackAula.Controllers
{
    //CONFIGURAÇÃO DA API
    [ApiController]
    [Route("api/[controller]")]

    public class PessoaEnderecoController : ControllerBase
    {
        //DECLARAÇÃO DO ATRIBUTO DO CONTEXT
        private readonly BdAulaBackendContext _context;

        //DECLARAÇÃO DO MÉTODO CONSTRUTOR
        public PessoaEnderecoController(BdAulaBackendContext context)
        {
            //INSTANCIANDO O ATRIBUTO _context
            _context = context;
        }
        //LISTAR TODAS AS PESSOAS COM SEUS RESPECTIVOS ENDEREÇOS

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PessoaDTO>>> GetAll(int id)
        {
            var pessoas = await _context.Pessoas
                .Select(p => new PessoaDTO
                {
                    IdPessoa = p.Idpessoa,
                    Nome = p.Nome,
                    //CPF = p.Cpf,
                    DataNascimento = p.DataNascimento,
                    Sexo = p.Sexo,
                    Email = p.Email,
                    Telefone = p.Telefone,
                    AtivoPessoa = p.AtivoPessoa,

                    Enderecos = p.Enderecos.Select(e => new EnderecoDTO
                    {
                        IdPessoa = e.Idpessoa,
                        CEP = e.Cep,
                        Numero = e.Numero,
                        Complemento = e.Complemento,

                    }).ToList()

                }).ToListAsync();

            return Ok(pessoas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PessoaDTO>> GetPessoa(int id)
        {
            var pessoa = await _context.Pessoas
                .Where(p => p.Idpessoa == id)
                .Select(p => new PessoaDTO
                {
                    IdPessoa = p.Idpessoa,
                    Nome = p.Nome,
                    //CPF = p.Cpf,
                    DataNascimento = p.DataNascimento,
                    Sexo = p.Sexo,
                    Email = p.Email,
                    Telefone = p.Telefone,
                    AtivoPessoa = p.AtivoPessoa,

                    Enderecos = p.Enderecos.Select(e => new EnderecoDTO
                    {
                        IdPessoa = e.Idpessoa,
                        CEP = e.Cep,
                        Numero = e.Numero,
                        Complemento = e.Complemento,

                    }).ToList()

                }).ToListAsync();

            return Ok(pessoa);
        }

        [HttpPost]
        public async Task<ActionResult<PessoaDTO>> Post(PessoaDTO dto)
        {
            var ObjPessoa = new Pessoa
            {
                Nome = dto.Nome,
                //Cpf = dto.CPF,
                DataNascimento = dto.DataNascimento,
                Sexo = dto.Sexo,
                Email = dto.Email,
                Telefone = dto.Telefone,
                AtivoPessoa = dto.AtivoPessoa,
                Enderecos = dto.Enderecos.Select(e => new Endereco
                {
                    Cep = e.CEP,
                    Numero = e.Numero,
                    Complemento = e.Complemento
                }).ToList()
            };

            _context.Pessoas.Add(ObjPessoa);

            await _context.SaveChangesAsync();

            var respostaBd = new PessoaDTO
            {
                IdPessoa = ObjPessoa.Idpessoa,
                Nome = ObjPessoa.Nome,
                //CPF = ObjPessoa.Cpf,
                DataNascimento = ObjPessoa.DataNascimento,
                Sexo = ObjPessoa.Sexo,
                Email = ObjPessoa.Email,
                Telefone = ObjPessoa.Telefone,
                Enderecos = ObjPessoa.Enderecos.Select(e => new EnderecoDTO
                {
                    IdPessoa = e.Idpessoa,
                    Numero = e.Numero,
                    CEP = e.Cep,
                    Complemento = e.Complemento
                }).ToList()

            };

            return CreatedAtAction(
                nameof(GetPessoa),
                new { id = ObjPessoa.Idpessoa },
                respostaBd
            );

        }
        [HttpPut("{id}")]
        public async Task<ActionResult<ActionResult<Pessoa>>> Put(int id, PessoaDTO dto)
        {
            //BUSCA A PESSOA E SEUS ENDEREÇOS E ATRIBUI A VARIÁVEL PESSOA
            var pessoa = await _context.Pessoas
                .Include(p => p.Enderecos)
                .FirstOrDefaultAsync( p  => p.Idpessoa == id );

            //VERIFICA SE A PESSOA EXISTE
            if ( pessoa == null ) {

                return NotFound();
             }

            //PROJETA OS DADOS DO PessoaDTO PARA O MODELO Pessoa ORIUNDA DO BANCO DE DADOS
            pessoa.Nome = dto.Nome;
            //pessoa.Cpf = dto.Cpf;
            pessoa.DataNascimento = dto.DataNascimento;
            pessoa.Sexo = dto.Sexo;
            pessoa.Email = dto.Email;
            pessoa.Telefone = dto.Telefone;
            pessoa.AtivoPessoa = dto.AtivoPessoa;

            //PERCORRE OS ENDEREÇOS DA PESSOA
            foreach(var endPessoa in dto.Enderecos)
            {
                //VERIFICA SE O ID VIM JA EXISTE COM A PESSOA
                if(endPessoa.IdPessoa > 0) 
                {
                    var endereco = pessoa.Enderecos  //BUSCA O ENDERECO DA PESSOA, NO ATRIBUTO DO MODELO Pessoa
                        .FirstOrDefault(e => e.Idpessoa == endPessoa.IdPessoa);
                    //CASO NÃO ENCONTRE, EMITE UMA MENSAGEM DE QUE O ENDEREÇO NÃO PERTENCE A ESSA PESSOA.
                    if (endereco != null) 
                    {
                        return BadRequest($"O endreço não pertence a essa pessoa");
                    }
                    //AO LOCALIZAR PORJETA NO MODELO Endereco OS DADOS VINDO DO ATRIBUTO Endereços
                    //DO MODELO O PESSOA QUE VENHA DO PessoaDTO 
                    endereco.Numero = endPessoa.Numero;
                    endereco.Cep = endereco.Cep;
                    endereco.Complemento = endPessoa.Complemento;
                }
                else
                {
                    //CASO O ID NÃO SEJA MAIOR QUE 0(ZERO) É UM NOVO ENDREÇO A SER ADICIONADO A PESSOA
                    pessoa.Enderecos.Add(new Endereco
                    {
                        Numero = endPessoa.Numero,
                        Cep = endPessoa.CEP,
                        Complemento = endPessoa.Complemento
                    });
                    
                }
            }

            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<Pessoa>>Delete(int id)
        {   
            //BUSCA A PESSOA E SEUS ENDEREÇOS E ATRIBUI A VARIÁVEL PESSOA
            var pessoa = await _context.Pessoas
                .Include(p => p.Enderecos)
                .FirstOrDefaultAsync(p => p.Idpessoa == id);

            //VERIFICA SE A PESSOA EXISTE
            if (pessoa != null)
            {
                return NotFound();
            }

            //PREPARA A INSTRUÇÃO PARA EXECUTAR E ATRIBUI A VARIÁVEL PESSOA
            _context.Pessoas.Remove(pessoa);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}


