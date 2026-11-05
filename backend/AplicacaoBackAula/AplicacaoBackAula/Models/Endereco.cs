
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace AplicacaoBackAula.Models;

public partial class Endereco
{
    public int Idendereco { get; set; }

    public int Idpessoa { get; set; }

    public string? Cep { get; set; }

    public string? Numero { get; set; }

    public string? Complemento { get; set; }

    [ValidateNever]
    public virtual Pessoa? IdpessoaNavigation { get; set; }
}
