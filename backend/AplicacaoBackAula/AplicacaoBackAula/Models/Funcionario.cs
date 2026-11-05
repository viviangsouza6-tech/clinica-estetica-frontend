
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace AplicacaoBackAula.Models;

public partial class Funcionario
{
    public int Idpessoa { get; set; }

    public string Cargo { get; set; } = null!;

    public DateOnly DataAdmissao { get; set; }

    public virtual ICollection<Atendimentoitem> Atendimentoitems { get; set; } = new List<Atendimentoitem>();

    [ValidateNever]
    public virtual Pessoa? IdpessoaNavigation { get; set; }
}
