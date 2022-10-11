const yup = require("yup");

const repository = require("../models/VeiculoRepository");

async function AddVeiculo(req, res) {
  var dados = req.body;

  const schema = yup.object().shape({   

      ano_fabricacao: yup.date().typeError("Erro: Necessário preencher o campo ano de fabricação!").required(),             
      modeloId: yup.number().typeError("Erro: Necessário preencher o campo modelo!").required().positive("O campo modelo deve ser positivo.").integer("O campo modelo deve ser um número inteiro."),
      fabricanteId: yup.number().typeError("Erro: Necessário preencher o campo fabricante!").required().positive("O campo fabricante deve ser positivo.").integer("O campo fabricante deve ser um número inteiro."), 
      status: yup.number().typeError("Erro: Necessário preencher o campo Ativo!").required().positive("O campo ativo deve ser positivo.").integer("O campo ativo deve ser um número inteiro."),      
      renavam: yup.number().typeError("Erro: Necessário preencher o campo renavam!").required().positive('O campo renavam deve ser positivo').integer("O campo renavam deve ser um número inteiro."),
      placa: yup.string().required("Erro: Necessário preencher o campo nome da placa!"),    
   
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  const veiculo = await repository.findOneVeiculo(req.body.placa);

  if (veiculo) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este veículo já está cadastrado!",
    });
  }  

  await repository.add(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Veículo cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Veículo não cadastrado com sucesso!",
      });
    });
};

async function getVeiculos(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countVeiculo = await repository.countVeiculo();
  if (countVeiculo === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum veículo encontrado!",
    });
  } else {
    lastPage = Math.ceil(countVeiculo / limit);
  }

  await repository.findAll()
    .then((veiculos) => {
      return res.json({
        erro: false,
        veiculos,
        countVeiculo,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum veículo encontrado!",
      });
    });
};

async function getVeiculosTime(req, res) {
  const { page = 1, dtInicio, dtFinal } = req.params;
  const limit = 7;
  let lastPage = 1;

  console.log("Datainicio: " + dtInicio);
    console.log("Datafinal: " + dtFinal); 


  const date = new Date(dtFinal + "-" + dtInicio);
    //console.log("Data: " + date);
    //console.log("Ano: " + date.getFullYear(), "/ Mês: " + date.getUTCMonth());    

    var primeiroDia = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
    var ultimoDia = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);  
   //console.log("primeiroDia: " + primeiroDia + "- ultimoDia: " + ultimoDia);

  const countVeiculo = await repository.countVeiculo();
  if (countVeiculo === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum veículo encontrado!",
    });
  } else {
    lastPage = Math.ceil(countVeiculo / limit);
  }  

  await repository.findAllTime(primeiroDia, ultimoDia)
    .then((veiculos) => {
      var totVeiculosAbastecimentos = [];
      var veiculoAbast = {
        placa: "",
        fabricante: "",
        totLitro: 0,
        totValorAbast: 0,
        totOdometro: 0
      };
      var abst = 0;
      var valorAbst = 0;
      var valorAbastParcial = 0;      
      var odometroInicialMes = 0;
      var odometroTotalMes = 0;
      var valorParcial = 0;
      var ultimoAbastPeriodo = 0;
      var tam = 0;      

      for (var i = 0; i < countVeiculo; i++) {        
        tam = veiculos[i].abastecimentos.length;
        veiculos[i].abastecimentos.map((abastecimento, indice) => {
           
          if (indice === 0) {
            odometroInicialMes = abastecimento.odometro_km;
          }
          odometroTotalMes = odometroTotalMes + abastecimento.odometro_km;
          valorParcial = odometroTotalMes - abastecimento.odometro_km;

          if (indice === tam - 1) {
            ultimoAbastPeriodo = abastecimento.qtd_litro;
          }
          
          abst = abst + abastecimento.qtd_litro;
          valorAbst = valorAbst + (abastecimento.qtd_litro * abastecimento.valor_litro) ;
          valorAbastParcial = valorAbst - (abastecimento.qtd_litro * abastecimento.valor_litro);
        });
  
      
        veiculoAbast.placa = veiculos[i].placa;
        veiculoAbast.fabricante = veiculos[i].fabricante.nome_fabricante;       
        veiculoAbast.totLitro = abst - ultimoAbastPeriodo;
        veiculoAbast.totValorAbast = valorAbastParcial;

        veiculoAbast.totOdometro = (odometroTotalMes - odometroInicialMes) - valorParcial;
  
        totVeiculosAbastecimentos[i] = veiculoAbast;
        

        veiculoAbast = {
          placa: "",
          fabricante: "",
          totLitro: 0,
          totValorAbast: 0,
          totOdometro: 0
        }
        valorAbst = 0;
        valorAbastParcial = 0;
        odometroInicialMes = 0;
        odometroTotalMes = 0;
        valorParcial = 0;
        ultimoAbastPeriodo = 0;
        abst = 0;       
      }      

      return res.json({
        erro: false,
        veiculos,
        countVeiculo,
        lastPage,
        abst,
        totVeiculosAbastecimentos
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum veículo encontrado!",
      });
    });
};



async function getVeiculosTrocaOleo(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countVeiculo = await repository.countVeiculo();
  if (countVeiculo === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum veículo encontrado!",
    });
  } else {
    lastPage = Math.ceil(countVeiculo / limit);
  }

  await repository.findAllTrocaOleo()
    .then((veiculos) => {
      var totVeiculosTrocaOleo = [];
      var veiculoTrocaOleo = {
        placa: "",
        fabricante: "",
        dtUltimaTroca: "",
        filtroOleo: 0,
        filtroCombustivel: 0,
        valorUltimaTroca: 0,
        odometroUltimaTroca: 0,
        odometroProximaTroca: 0,
        odometroAtualVeiculo: 0,
      };

      var odProximaTrocaOleo = 0;
      var odUltimaTrocaOleo = 0;
      var odAtualVeiculo = 0;
      var dtTroca = "";
      var valorTroca = 0;
      var filComb = 0;
      var filOleo = 0;
      var tamTrocaOleo = 0;
      var tamAbastecimento = 0; 



      for (var i = 0; i < countVeiculo; i++) {  
        
        
        tamAbastecimento = veiculos[i].abastecimentos.length;
        veiculos[i].abastecimentos.map((abastecimento, indice) => {        

          if (indice === tamAbastecimento - 1) {
            odAtualVeiculo = abastecimento.odometro_km;            
          }          
          
        });




        tamTrocaOleo = veiculos[i].trocaoleos.length;
        veiculos[i].trocaoleos.map((trocaOleo, indice) => {        
          

          if (indice === tamTrocaOleo - 1) {
            odUltimaTrocaOleo = trocaOleo.odometro_atual;
            odProximaTrocaOleo = trocaOleo.odometro_troca;
            dtTroca = trocaOleo.data_troca;
            valorTroca = trocaOleo.valor_troca;
            filComb = trocaOleo.filtro_combustivel;
            filOleo = trocaOleo.filtro_oleo;
          }          
          
        });
  
      
        veiculoTrocaOleo.placa = veiculos[i].placa;
        veiculoTrocaOleo.fabricante = veiculos[i].fabricante.nome_fabricante;       
        veiculoTrocaOleo.odometroUltimaTroca = odUltimaTrocaOleo;
        veiculoTrocaOleo.odometroProximaTroca = odProximaTrocaOleo;
        veiculoTrocaOleo.dtUltimaTroca = dtTroca;
        veiculoTrocaOleo.valorUltimaTroca = valorTroca;
        veiculoTrocaOleo.filtroCombustivel = filComb;
        veiculoTrocaOleo.filtroOleo = filOleo;
        veiculoTrocaOleo.odometroAtualVeiculo = odAtualVeiculo;

        
  
        totVeiculosTrocaOleo[i] = veiculoTrocaOleo;
        

        veiculoTrocaOleo = {
          placa: "",
          fabricante: "",
          dtUltimaTroca: "",
          filtroOleo: 0,
          filtroCombustivel: 0,
          valorUltimaTroca: 0,
          odometroUltimaTroca: 0,
          odometroProximaTroca: 0,
          odometroAtualVeiculo: 0,
        }


        odProximaTrocaOleo = 0;
        odUltimaTrocaOleo = 0;
        odAtualVeiculo = 0;
        dtTroca = "";
        valorTroca = 0;
        filComb = 0;
        filOleo = 0;   
      }

      return res.json({
        erro: false,
        veiculos,
        totVeiculosTrocaOleo,
        countVeiculo,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum veículo encontrado!",
      });
    });
};

async function getVeiculosMntTime(req, res) {
  const { page = 1, dtInicio, dtFinal } = req.params;
  const limit = 7;
  let lastPage = 1;

  console.log("Datainicio: " + dtInicio);
    console.log("Datafinal: " + dtFinal); 


  const date = new Date(dtFinal + "-" + dtInicio);
    //console.log("Data: " + date);
    //console.log("Ano: " + date.getFullYear(), "/ Mês: " + date.getUTCMonth());    

    var primeiroDia = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
    var ultimoDia = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);  
   //console.log("primeiroDia: " + primeiroDia + "- ultimoDia: " + ultimoDia);

  const countVeiculo = await repository.countVeiculo();
  if (countVeiculo === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum veículo encontrado!",
    });
  } else {
    lastPage = Math.ceil(countVeiculo / limit);
  }  

  await repository.findAllMntTime(primeiroDia, ultimoDia)
    .then((veiculos) => {
      var totVeiculosManutencoes = [];
      var veiculoMnt = {
        placa: "",
        fabricante: "",
        valorTotLatariaPintura: 0,
        valorTotMecanica: 0,
        valorTotPneus: 0,
        valorTotLavagem: 0,
        valorTotalMnt: 0,
      };

      var qtdMntVeiculo = 0;
      var totLatPin = 0;
      var totMec = 0;
      var totPneu = 0;
      var totLav = 0;
    
      for (var i = 0; i < countVeiculo; i++) { 
       // qtdMntVeiculo = veiculos[i].manutencoes.length;
        veiculos[i].manutencoes.map((manutencao, indice) => {

          switch (manutencao.servico.nome_servico) {
            case 'LATARIA E PINTURA':
              totLatPin = totLatPin + manutencao.valor_mnt;
              break;
            case 'MECÂNICA':
              totMec = totMec + manutencao.valor_mnt;
              break;
            case 'PNEUS':
              totPneu = totPneu + manutencao.valor_mnt;
              break;
            case 'LAVAGEM VEÍCULO':
              totLav = totLav + manutencao.valor_mnt;
              break;           
          }          
        });

          veiculoMnt.placa = veiculos[i].placa;
          veiculoMnt.fabricante = veiculos[i].fabricante.nome_fabricante;
          veiculoMnt.valorTotLatariaPintura = totLatPin;
          veiculoMnt.valorTotMecanica = totMec;
          veiculoMnt.valorTotPneus = totPneu;
          veiculoMnt.valorTotLavagem = totLav;
          veiculoMnt.valorTotalMnt = (totLatPin+totMec+totPneu+totLav);

          totVeiculosManutencoes[i] = veiculoMnt;

          veiculoMnt = {
            placa: "",
            fabricante: "",
            valorTotLatariaPintura: 0,
            valorTotMecanica: 0,
            valorTotPneus: 0,
            valorTotLavagem: 0,
            valorTotalMnt: 0,
          };

          totLatPin = 0;
          totMec = 0;
          totPneu = 0;
          totLav = 0;

      }

     {/*} var totVeiculosAbastecimentos = [];
      var veiculoAbast = {
        placa: "",
        fabricante: "",
        totLitro: 0,
        totValorAbast: 0,
        totOdometro: 0
      };
      var abst = 0;
      var valorAbst = 0;
      var valorAbastParcial = 0;      
      var odometroInicialMes = 0;
      var odometroTotalMes = 0;
      var valorParcial = 0;
      var ultimoAbastPeriodo = 0;
      var tam = 0;      

      for (var i = 0; i < countVeiculo; i++) {        
        tam = veiculos[i].abastecimentos.length;
        veiculos[i].abastecimentos.map((abastecimento, indice) => {
           
          if (indice === 0) {
            odometroInicialMes = abastecimento.odometro_km;
          }
          odometroTotalMes = odometroTotalMes + abastecimento.odometro_km;
          valorParcial = odometroTotalMes - abastecimento.odometro_km;

          if (indice === tam - 1) {
            ultimoAbastPeriodo = abastecimento.qtd_litro;
          }
          
          abst = abst + abastecimento.qtd_litro;
          valorAbst = valorAbst + (abastecimento.qtd_litro * abastecimento.valor_litro) ;
          valorAbastParcial = valorAbst - (abastecimento.qtd_litro * abastecimento.valor_litro);
        });
  
      
        veiculoAbast.placa = veiculos[i].placa;
        veiculoAbast.fabricante = veiculos[i].fabricante.nome_fabricante;       
        veiculoAbast.totLitro = abst - ultimoAbastPeriodo;
        veiculoAbast.totValorAbast = valorAbastParcial;

        veiculoAbast.totOdometro = (odometroTotalMes - odometroInicialMes) - valorParcial;
  
        totVeiculosAbastecimentos[i] = veiculoAbast;
        

        veiculoAbast = {
          placa: "",
          fabricante: "",
          totLitro: 0,
          totValorAbast: 0,
          totOdometro: 0
        }
        valorAbst = 0;
        valorAbastParcial = 0;
        odometroInicialMes = 0;
        odometroTotalMes = 0;
        valorParcial = 0;
        ultimoAbastPeriodo = 0;
        abst = 0;       
      }*/}    

      return res.json({
        erro: false,
        veiculos,
        countVeiculo,
        lastPage,
       // abst,
        totVeiculosManutencoes
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum veículo encontrado!",
      });
    });
};

async function getVeiculo(req, res) {
  const { id, mes, ano } = req.params;

  const date = new Date(ano + "-" + mes);
   // console.log("Data: " + date);
   // console.log("Ano: " + date.getFullYear(), "/ Mês: " + date.getUTCMonth());    

    var primeiroDia = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
    var ultimoDia = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);  
    //console.log("primeiroDia: " + primeiroDia + "- ultimoDia: " + ultimoDia);

  await repository.findByIdMntThree(id, primeiroDia, ultimoDia)
    .then((veiculo) => {  

      //********************************************************* */
    const abst = veiculo.abastecimentos;
    var odometroInicialMes;
    var odometroTotalMes = 0;
    var qtdLitrosMes = 0;
    var ValorTotalqtdLitrosMes = 0;
    var tam = abst.length;
    var qtdLitroFinal = 0;
    var valorParcial = 0;
    var valorParcialLitro = 0;
    var valorUltimoOdometro = 0;
    abst.map((val, indice) => {
    if (indice === 0) {
      odometroInicialMes = val.odometro_km;
    }
    if (indice === tam - 1) {
      qtdLitroFinal = val.qtd_litro;
      valorUltimoOdometro = val.odometro_km;
    }
    odometroTotalMes = odometroTotalMes + val.odometro_km;
    valorParcial = odometroTotalMes - val.odometro_km;
    qtdLitrosMes = qtdLitrosMes + val.qtd_litro;
    ValorTotalqtdLitrosMes = ValorTotalqtdLitrosMes + val.qtd_litro * val.valor_litro;
    valorParcialLitro = ValorTotalqtdLitrosMes - val.qtd_litro * val.valor_litro;
  });

  var kmMes = odometroTotalMes - odometroInicialMes;
  var kmRodadoMes = kmMes - valorParcial;
  //var mediaKmMesPorLitro = kmMes / (qtdLitrosMes - qtdLitroFinal);
  var mediaKmMesPorLitro = kmRodadoMes / (qtdLitrosMes - qtdLitroFinal);
  //veiculo['kmMes'] = kmMes;

     //*********************************************************** */      
      return res.json({
        erro: false,
        veiculo: veiculo,
        valorParcialLitro: valorParcialLitro,
        kmRodadoMes: kmRodadoMes,
        mediaKmMesPorLitro: mediaKmMesPorLitro,
        valorUltimoOdometro: valorUltimoOdometro,                 
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum veículo encontrado!",
      });
    });
};

async function getVeiculo1(req, res) {
  const { id } = req.params;  

  //await repository.findById1(id)
  await repository.findOneVeiculoId(id)
    .then((veiculo) => { 
      const abst = veiculo.abastecimentos;
      var tam = abst.length; 
      var valorUltimoOdometro = 0;

      abst.map((val, indice) => {        
        if (indice === tam - 1) {         
          valorUltimoOdometro = val.odometro_km;
        }       
      });      

      return res.json({
        erro: false,
        veiculo: veiculo,
        valorUltimoOdometro: valorUltimoOdometro,        
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum veículo encontrado!",
      });
    });
};

async function setVeiculoId(req, res) {
  const { id } = req.params;

  const veiculo = await repository.findOneVeiculoId(id);
  
  veiculo.status = 2;
  
  await veiculo.save()
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Veículo apagado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Veículo não apagado com sucesso!",
      });
    });
};

module.exports = {AddVeiculo,
                  getVeiculos,
                  getVeiculo,
                  getVeiculo1,
                  setVeiculoId,
                  getVeiculosTime, 
                  getVeiculosMntTime,
                  getVeiculosTrocaOleo,               
                  };