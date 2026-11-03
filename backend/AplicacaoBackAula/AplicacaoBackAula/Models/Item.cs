using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace AplicacaoBackAula.Models;

public partial class Item
{
    public int Iditem { get; set; }

    public int Idcategoria { get; set; }

    public string Item1 { get; set; } = null!;

    public string DescricaoItem { get; set; } = null!;

    public decimal Preco { get; set; }

    public string TipoItem { get; set; } = null!;

    public string AtivoProdutoServico { get; set; } = null!;

    public virtual ICollection<Atendimentoitem> Atendimentoitems { get; set; } = new List<Atendimentoitem>();

    [ValidateNever]
    public virtual Categorium? IdcategoriaNavigation { get; set; }

    public virtual Produto? Produto { get; set; }
}