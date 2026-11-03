namespace AplicacaoBackAula.DTO
{
    public class FuncionarioDTO
    {
        public int IdPessoa { get; set; }

        // DADOS DA TABELA FUNCIONARIO
        public string? Cargo { get; set; }
        public DateOnly DataAdmissao { get; set; }

        // DADOS DA TABELA PESSOA
        public PessoaDTO? Pessoa { get; set; }
    }
}