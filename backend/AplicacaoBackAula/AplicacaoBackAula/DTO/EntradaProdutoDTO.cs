namespace AplicacaoBackAula.DTO
{
    public class EntradaProdutoDTO
    {
        public int IdentradaProduto { get; set; }

        public int Iditem { get; set; }

        public DateOnly DataEntradaProduto { get; set; }

        public decimal QuantidadeEntrada { get; set; }

        public string? Unidade { get; set; }

        public decimal ValorUnitarioEntrada { get; set; }
    }
}