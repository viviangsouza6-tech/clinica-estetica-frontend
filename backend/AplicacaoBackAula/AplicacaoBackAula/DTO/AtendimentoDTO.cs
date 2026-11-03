namespace AplicacaoBackAula.DTO
{
    public class AtendimentoDTO
    {
        public int Idatendimento { get; set; }

        public int Idpessoa { get; set; }

        public DateOnly DataAtendimento { get; set; }

        public string? StatusAtendimento { get; set; }

        public List<AtendimentoItemDTO> Itens { get; set; } = new();
    }
}