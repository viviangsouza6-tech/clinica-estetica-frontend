using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AplicacaoBackAula.Models;
using AplicacaoBackAula.DTO;

namespace AplicacaoBackAula.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FuncionarioController : ControllerBase
    {
        private readonly BdAulaBackendContext _context;

        public FuncionarioController(BdAulaBackendContext context)
        {
            _context = context;
        }

        // ==========================================
        // GET - LISTAR TODOS OS FUNCIONÁRIOS
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FuncionarioDTO>>> GetFuncionarios()
        {
            var funcionarios = await _context.Funcionarios
                .Include(f => f.IdpessoaNavigation)
                .ThenInclude(p => p.Enderecos)
                .ToListAsync();

            var resultado = funcionarios.Select(f => new FuncionarioDTO
            {
                IdPessoa = f.Idpessoa,
                Cargo = f.Cargo,
                DataAdmissao = f.DataAdmissao,

                Pessoa = new PessoaDTO
                {
                    IdPessoa = f.IdpessoaNavigation.Idpessoa,
                    Nome = f.IdpessoaNavigation.Nome,
                    DataNascimento = f.IdpessoaNavigation.DataNascimento,
                    Sexo = f.IdpessoaNavigation.Sexo,
                    Email = f.IdpessoaNavigation.Email,
                    Telefone = f.IdpessoaNavigation.Telefone,
                    AtivoPessoa = f.IdpessoaNavigation.AtivoPessoa,

                    Enderecos = f.IdpessoaNavigation.Enderecos
                        .Select(e => new EnderecoDTO
                        {
                            IdEndereco = e.Idendereco,
                            IdPessoa = e.Idpessoa,
                            CEP = e.Cep,
                            Numero = e.Numero,
                            Complemento = e.Complemento
                        }).ToList()
                }
            }).ToList();

            return Ok(resultado);
        }

        // ==========================================
        // GET - BUSCAR FUNCIONÁRIO PELO ID
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<FuncionarioDTO>> GetFuncionario(int id)
        {
            var funcionario = await _context.Funcionarios
                .Include(f => f.IdpessoaNavigation)
                .ThenInclude(p => p.Enderecos)
                .FirstOrDefaultAsync(f => f.Idpessoa == id);

            if (funcionario == null)
            {
                return NotFound(new
                {
                    mensagem = "Funcionário não localizado"
                });
            }

            var resultado = new FuncionarioDTO
            {
                IdPessoa = funcionario.Idpessoa,
                Cargo = funcionario.Cargo,
                DataAdmissao = funcionario.DataAdmissao,

                Pessoa = new PessoaDTO
                {
                    IdPessoa = funcionario.IdpessoaNavigation.Idpessoa,
                    Nome = funcionario.IdpessoaNavigation.Nome,
                    DataNascimento = funcionario.IdpessoaNavigation.DataNascimento,
                    Sexo = funcionario.IdpessoaNavigation.Sexo,
                    Email = funcionario.IdpessoaNavigation.Email,
                    Telefone = funcionario.IdpessoaNavigation.Telefone,
                    AtivoPessoa = funcionario.IdpessoaNavigation.AtivoPessoa,

                    Enderecos = funcionario.IdpessoaNavigation.Enderecos
                        .Select(e => new EnderecoDTO
                        {
                            IdEndereco = e.Idendereco,
                            IdPessoa = e.Idpessoa,
                            CEP = e.Cep,
                            Numero = e.Numero,
                            Complemento = e.Complemento
                        }).ToList()
                }
            };

            return Ok(resultado);
        }

        // ==========================================
        // POST - CADASTRAR FUNCIONÁRIO
        // ==========================================
        [HttpPost]
        public async Task<ActionResult<FuncionarioDTO>> PostFuncionario(
            FuncionarioDTO dados)
        {
            if (dados.Pessoa == null)
            {
                return BadRequest(new
                {
                    mensagem = "Os dados da pessoa são obrigatórios"
                });
            }

            // CADASTRA A PESSOA
            var pessoa = new Pessoa
            {
                Nome = dados.Pessoa.Nome,
                DataNascimento = dados.Pessoa.DataNascimento,
                Sexo = dados.Pessoa.Sexo,
                Email = dados.Pessoa.Email,
                Telefone = dados.Pessoa.Telefone,
                AtivoPessoa = dados.Pessoa.AtivoPessoa
            };

            _context.Pessoas.Add(pessoa);

            // SALVA PRIMEIRO PARA GERAR O ID DA PESSOA
            await _context.SaveChangesAsync();

            // CADASTRA OS ENDEREÇOS
            foreach (var enderecoDTO in dados.Pessoa.Enderecos)
            {
                var endereco = new Endereco
                {
                    Idpessoa = pessoa.Idpessoa,
                    Cep = enderecoDTO.CEP,
                    Numero = enderecoDTO.Numero,
                    Complemento = enderecoDTO.Complemento
                };

                _context.Enderecos.Add(endereco);
            }

            // CADASTRA O FUNCIONÁRIO
            var funcionario = new Funcionario
            {
                Idpessoa = pessoa.Idpessoa,
                Cargo = dados.Cargo!,
                DataAdmissao = dados.DataAdmissao
            };

            _context.Funcionarios.Add(funcionario);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetFuncionario),
                new { id = funcionario.Idpessoa },
                dados
            );
        }

        // ==========================================
        // PUT - ATUALIZAR FUNCIONÁRIO
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFuncionario(
            int id,
            FuncionarioDTO dados)
        {
            var funcionario = await _context.Funcionarios
                .Include(f => f.IdpessoaNavigation)
                .ThenInclude(p => p.Enderecos)
                .FirstOrDefaultAsync(f => f.Idpessoa == id);

            if (funcionario == null)
            {
                return NotFound(new
                {
                    mensagem = "Funcionário não localizado"
                });
            }

            if (dados.Pessoa == null)
            {
                return BadRequest(new
                {
                    mensagem = "Os dados da pessoa são obrigatórios"
                });
            }

            // ATUALIZA FUNCIONÁRIO
            funcionario.Cargo = dados.Cargo!;
            funcionario.DataAdmissao = dados.DataAdmissao;

            // ATUALIZA PESSOA
            funcionario.IdpessoaNavigation.Nome =
                dados.Pessoa.Nome;

            funcionario.IdpessoaNavigation.DataNascimento =
                dados.Pessoa.DataNascimento;

            funcionario.IdpessoaNavigation.Sexo =
                dados.Pessoa.Sexo;

            funcionario.IdpessoaNavigation.Email =
                dados.Pessoa.Email;

            funcionario.IdpessoaNavigation.Telefone =
                dados.Pessoa.Telefone;

            funcionario.IdpessoaNavigation.AtivoPessoa =
                dados.Pessoa.AtivoPessoa;

            // ==========================================
            // ENDEREÇOS RECEBIDOS NO DTO
            // ==========================================
            var idsRecebidos = dados.Pessoa.Enderecos
                .Where(e => e.IdEndereco.HasValue)
                .Select(e => e.IdEndereco!.Value)
                .ToHashSet();

            // ==========================================
            // REMOVE ENDEREÇOS QUE NÃO VIERAM MAIS
            // ==========================================
            var enderecosRemover =
                funcionario.IdpessoaNavigation.Enderecos
                .Where(e => !idsRecebidos.Contains(e.Idendereco))
                .ToList();

            _context.Enderecos.RemoveRange(enderecosRemover);

            // ==========================================
            // ATUALIZA OU ADICIONA ENDEREÇOS
            // ==========================================
            foreach (var enderecoDTO in dados.Pessoa.Enderecos)
            {
                // ENDEREÇO QUE JÁ EXISTE
                if (enderecoDTO.IdEndereco.HasValue)
                {
                    var endereco =
                        funcionario.IdpessoaNavigation.Enderecos
                        .FirstOrDefault(e =>
                            e.Idendereco == enderecoDTO.IdEndereco.Value);

                    if (endereco == null)
                    {
                        return BadRequest(new
                        {
                            mensagem = "O endereço não pertence a essa pessoa"
                        });
                    }

                    endereco.Cep = enderecoDTO.CEP;
                    endereco.Numero = enderecoDTO.Numero;
                    endereco.Complemento = enderecoDTO.Complemento;
                }
                else
                {
                    // NOVO ENDEREÇO
                    funcionario.IdpessoaNavigation.Enderecos.Add(
                        new Endereco
                        {
                            Idpessoa = funcionario.Idpessoa,
                            Cep = enderecoDTO.CEP,
                            Numero = enderecoDTO.Numero,
                            Complemento = enderecoDTO.Complemento
                        }
                    );
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensagem = "Funcionário atualizado com sucesso"
            });
        }

        // ==========================================
        // DELETE - EXCLUIR FUNCIONÁRIO
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFuncionario(int id)
        {
            var funcionario = await _context.Funcionarios
                .Include(f => f.IdpessoaNavigation)
                .ThenInclude(p => p.Enderecos)
                .FirstOrDefaultAsync(f => f.Idpessoa == id);

            if (funcionario == null)
            {
                return NotFound(new
                {
                    mensagem = "Funcionário não localizado"
                });
            }

            // REMOVE O FUNCIONÁRIO
            _context.Funcionarios.Remove(funcionario);

            // REMOVE OS ENDEREÇOS
            _context.Enderecos.RemoveRange(
                funcionario.IdpessoaNavigation.Enderecos
            );

            // REMOVE A PESSOA
            _context.Pessoas.Remove(
                funcionario.IdpessoaNavigation
            );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensagem = "Funcionário excluído com sucesso"
            });
        }
    }
}