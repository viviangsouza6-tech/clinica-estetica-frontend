namespace AplicacaoBackAula.DTO
{
    public class produtoDTO
    {
        public int Idcategoria { get; set; }
        public string? Item { get; set; }
        public string? DescricaoItem { get; set; }
        public decimal? Preco {  get; set; }
        public string? TipoItem { get; set; }

        public string? AtivoProdutoServico {  get; set; }

        //DADOS TABELA 

        //DADOS TABELA PRODUTO
        public int CodigoPreco { get; set; }
        public decimal PrecoVenda { get; set; }
        public string? Unidade { get; set; }

    }
}
