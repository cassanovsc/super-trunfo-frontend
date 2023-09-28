
const updateMeusCards = () => {
  console.log("atualizando cards");
  let table = document.getElementById('meusCards');
  table.innerHTML = '';
  let i;
  let plan_html = ''

  for (i = 0; i < lista_animais.length; i++) {
    animal_obtido = meus_animais.some((animal) => { return animal.nome === lista_animais[i].nome; });
    console.log(animal_obtido);
    if (animal_obtido) {
      plan_html = '<div class="deck-animal"><img src="' + lista_animais[i].imagem + '" alt="' + lista_animais[i].nome + '"/></div>';
    }
    else {
      plan_html = '<div class="deck-animal-desconhecido"><span>?</span></div>';
    }
    table.innerHTML += plan_html;
    console.log(lista_animais[i].nome);
  }
}


function getMeusAnimais() {
  return new Promise((resolve, reject) => {
    let url = 'http://127.0.0.1:5010/tema?nome=animais';
    fetch(url, {
      method: 'get'
    }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('pegou animais no tema');
        console.log(data.itens);
        resolve(data.itens);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      });
  })
}




const getListaTemas = new Promise((resolve, reject) => {
  let url = 'http://127.0.0.1:5010/temas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      resolve(data.temas);
    })
    .catch((error) => {
      console.error('Error:', error);
      reject(error);
    })
});


function postTemaAnimal() {
  return new Promise((resolve, reject) => {
    console.log('post Tema animais');
    const formData = new FormData();
    formData.append('nome', 'animais');
  
    let url = 'http://127.0.0.1:5010/tema';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('criado tema animal');
        resolve(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
}

const postMeuAnimal = async (nome_animal) => {
  console.log('criando ' + nome_animal);
  const formData = new FormData();
  formData.append('nome_item', nome_animal);
  formData.append('nome_tema', 'animais');

  let url = 'http://127.0.0.1:5010/item';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('criado animal  ' + nome_animal)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


const getListaAnimais = new Promise((resolve, reject) => {
  let url = 'http://127.0.0.1:5000/animais';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      resolve(data.animais);
    })
    .catch((error) => {
      console.error('Error:', error);
      reject(error);
    })
});


const startAnimais = async () => {
  lista_animais = [];
  lista_animais = await getListaAnimais;
  lista_animais.sort((a, b) => (a.id > b.id) ? 1 : -1);
  console.log(lista_animais.length);
  temas = await getListaTemas;
  console.log(temas.length);
  //meus_animais = await 
  if (temas.some((tema) => { return tema.nome === 'animais'; })) {
    console.log('tem tema');
  } else {
    console.log('nao tem tema');
    await postTemaAnimal();
  }
  console.log('pegando animais');
  meus_animais = await getMeusAnimais();

  console.log('pegou animais ' + meus_animais.length);
  if (meus_animais.length < 10) {
    meus_animais = [];
    for (let i = 0; i <= 10; i++) {
      console.log(lista_animais[i].nome + ' ' + lista_animais[i].id);
      await postMeuAnimal(lista_animais[i].nome);
      meus_animais.push(lista_animais[i])
    }
  }
  updateMeusCards();
  await getAdversario();
  updateBotoes(1, 0, 0, 1);
};


let lista_animais;
let meus_animais;
let temas;
let minhas_cartas_em_jogo;
let adversario_cartas_em_jogo;
let rodada;
let minha_pontuacao;
let adversario_pontuacao;
let step_do_jogo;
let tipo_selecao; //maior (1) ou menor (-1)
let tipo_categoria;
let valor_meu_animal;
let valor_adversario_animal;
startAnimais();

let adversario;


const resetarAnimais = async () => {
  console.log('deletando animais');
  const formData = new FormData();
  formData.append('nome_tema', 'animais');

  let url = 'http://127.0.0.1:5010/itens';
  fetch(url, {
    method: 'delete',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('deletado todos os animais')
      meus_animais = [];
      console.log("tamanho meus animais: " + meus_animais.length)

      limparRodada();
      startAnimais();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const addMeusAnimais = async (qtde) => {
  while (qtde > 0) {
    if (meus_animais.length < 21) {
      await postMeuAnimal(lista_animais[meus_animais.length].nome);
      meus_animais.push(lista_animais[meus_animais.length]);
    }
    qtde--;
  }
  updateMeusCards();
}


function getAdversario() {
  return new Promise((resolve, reject) => {
    let url = 'https://randomuser.me/api/';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        adversario = data.results[0];
        resolve(data.results[0]);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      })
  })
}

const infoAdversario = () => {
  console.log(adversario.dob.age);
  console.log(adversario.name.first + ' ' + adversario.name.last);
  console.log(adversario.location.city);
  console.log(adversario.picture.large);
};

const limparRodada = async () => {
  document.getElementById('area-board').innerHTML = '';
  await getAdversario();
  updateBotoes(1, 0, 0, 1);
}


Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
}

const avancarStep = () => {
  console.log('step atual:' + step_do_jogo);
  if (step_do_jogo === 1) {
    step_do_jogo = 2;
    updateBotoes(1, 0, 0, 1);
  }
  else if (step_do_jogo === 2) {
    step_do_jogo = 3;
  }
  else if (step_do_jogo === 3) {
    rodada += 1;
    if (rodada === 7) {
      step_do_jogo = 5;
      if (minha_pontuacao === adversario_pontuacao) {
        addMeusAnimais(1);
      } else if (minha_pontuacao > adversario_pontuacao) {
        addMeusAnimais(2);
      }
      updateMeusCards();
    }
    else if (rodada % 2 === 0) {
      step_do_jogo = 4;
    } else {
      step_do_jogo = 1;
    }
  }
  else if (step_do_jogo === 4) {
    step_do_jogo = 3;
  }
  atualizarBoard();
}


const updateBotoes = (btstart, btnext, btstop, btreset) => {
  let areaBotoesHtml = document.getElementById('area-buttons');
  let content = '';
  if (btstart === 1) {
    content += '<div class="button on button-start" onClick="comecarJogo()"><span>Nova Partida</span></div>'
  } else {
    content += '<div class="button off button-start"><span>Nova Partida</span></div>'
  }

  if (btnext === 1) {
    content += '<div class="button on button-next" onClick="avancarStep()"><span>Avançar</span></div>'
  } else {
    content += '<div class="button off button-next"><span>Avançar</span></div>'
  }

  if (btstop === 1) {
    content += '<div class="button on button-stop" onclick="limparRodada()"><span>Desistir</span></div>'
  } else {
    content += '<div class="button off button-stop""><span>Desistir</span></div>'
  }

  if (btreset === 1) {
    content += '<div class="button on button-reset" onClick="resetarAnimais()"><span>Resetar Game</span></div>'
  } else {
    content += '<div class="button off button-reset"><span>Resetar Game</span></div>'
  }

  areaBotoesHtml.innerHTML = '';
  areaBotoesHtml.innerHTML += content;
}


let calculaRankingCard = (selecao, categoria, nome) => {
  let aux_lista_animais = lista_animais.slice(0,20);
  console.log('calculando ranking para ' + nome);
  console.log('selecao ' + selecao);
  console.log('categoria ' + categoria);
  if (categoria === 'vida') { 
    aux_lista_animais.sort((a, b) => (a.vida > b.vida) ? -selecao : selecao);
    console.log('ranking idade: ' + aux_lista_animais.findIndex(x => x.nome === nome));
  } else if (categoria === 'tamanho') {
    aux_lista_animais.sort((a, b) => (a.tamanho > b.tamanho) ? -selecao : selecao);
    console.log('ranking tamanho: ' + aux_lista_animais.findIndex(x => x.nome === nome));
  } else if (categoria === 'velocidade') {
    aux_lista_animais.sort((a, b) => (a.velocidade > b.velocidade) ? -selecao : selecao);
    console.log('ranking velocidade: ' + aux_lista_animais.findIndex(x => x.nome === nome));
  } else if (categoria === 'peso') {
    aux_lista_animais.sort((a, b) => (a.peso > b.peso) ? -selecao : selecao);
    console.log('ranking peso: ' + aux_lista_animais.findIndex(x => x.nome === nome));
  } 
  
  return aux_lista_animais.findIndex(x => x.nome === nome);
}

const atualizarBoard = () => {
  console.log("BOARD ATUAL: " + step_do_jogo);
  if (step_do_jogo === 1) {
    let minha_carta = lista_animais.find(item => item.nome === minhas_cartas_em_jogo[0].nome);
    console.log('carta atual: ');
    console.log(minha_carta);
    let areaBoardHtml = document.getElementById('area-board');
    let content = '<div class="area1">  <div class="player-title">  <span>Carta Atual</span>  </div>  <div class="player-info">  <div class="animal-deck">  <div id="animal-nome"><span>' + minha_carta.nome + '</span></div>  <div id="animal-imagem"><img src="' + minha_carta.imagem + '"  alt="imagem do animal" /></div>  <div class="animal-info">  <div class="menos" onClick="selecionarItem(-1,' + minha_carta.vida + ",'vida'" + ')">  <span>-</span>  </div>  <div id="vida-animal"><span>Vida: ' + minha_carta.vida + ' anos</span></div>  <div class="mais" onClick="selecionarItem(1,' + minha_carta.vida + ",'vida'" + ')">  <span>+</span>  </div>  </div>  <div class="animal-info">  <div class="menos"  onClick="selecionarItem(-1,' + minha_carta.velocidade + ",'velocidade'" + ')">  <span>-</span>  </div>  <div id="velocidade-animal"><span>Velocidade: ' + minha_carta.velocidade + 'km/h</span></div>  <div class="mais" onClick="selecionarItem(1,' + minha_carta.velocidade + ",'velocidade'" + ')">  <span>+</span>  </div>  </div>  <div class="animal-info">  <div class="menos"  onClick="selecionarItem(-1,' + minha_carta.peso + ",'peso'" + ')">  <span>-</span>  </div>  <div id="peso-animal"><span>Peso: ' + minha_carta.peso + 'kg</span></div>  <div class="mais"  onClick="selecionarItem(1,' + minha_carta.peso + ",'peso'" + ')">  <span>+</span>  </div>  </div>  <div class="animal-info">  <div class="menos"  onClick="selecionarItem(-1,' + minha_carta.tamanho + ",'tamanho'" + ')">  <span>-</span>  </div>  <div id="tamanho-animal"><span>Tamanho: ' + minha_carta.tamanho + 'm</span></div>  <div class="mais" onClick="selecionarItem(1,' + minha_carta.tamanho + ",'tamanho'" + ')">  <span>+</span>  </div>  </div>  </div>  </div>  </div>  <div class="area2">  <div class="partida-info"><span>Escolha o item que você acha que seja maior ou menor que o mesmo item seu adversário</span></div>  <div class="partida-cards">  <div class="card-user">  <div class="placar">  <h3>' + minha_pontuacao + '</h3>  </div>  <div class="carta-selecionada" style="opacity: 0;">   </div>  </div>  <div class="card-adversario">  <div class="placar">  <h3>' + adversario_pontuacao + '</h3>  </div>  <div class="carta-selecionada" style="opacity: 0;">   </div>  </div>  </div>  </div>  <div class="area3">  <div class="player-title">  <span>Adversário</span>  </div>  <div class="player-info">  <div id="nome-adversario"><span>' + adversario.name.first + ' ' + adversario.name.last + '</span></div>  <div id="imagem-adversario">  <img src="' + adversario.picture.large + '" alt="imagem do adversário" />  </div>  <div id="cidade-adversario"><span>Cidade: ' + adversario.location.city + '</span></div>  <div id="idade-adversario"><span>Idade: ' + adversario.dob.age + ' anos</span></div>  </div>  </div>'
    updateBotoes(0, 0, 1, 1);
    areaBoardHtml.innerHTML = '';
    areaBoardHtml.innerHTML += content;
  }
  else if (step_do_jogo === 2) {
    let minha_carta = lista_animais.find(item => item.nome === minhas_cartas_em_jogo[0].nome);
    console.log('carta atual: ');
    console.log(minha_carta);
    let aux_valor_meu_animal;
    if (tipo_categoria === 'vida') {
      aux_valor_meu_animal = 'Vida: ' + valor_meu_animal + ' anos';
    } else if (tipo_categoria === 'velocidade') {
      aux_valor_meu_animal = 'Velocidade: ' + valor_meu_animal + 'km/h';
    } else if (tipo_categoria === 'peso') {
      aux_valor_meu_animal = 'Peso: ' + valor_meu_animal + 'kg';
    } else if (tipo_categoria === 'tamanho') {
      aux_valor_meu_animal = 'Tamanho: ' + valor_meu_animal + 'm';
    }
    let areaBoardHtml = document.getElementById('area-board');
    let content = '<div class="area1">  <div class="player-title">  <span>Carta Atual</span>  </div>  <div class="player-info">  <div class="animal-deck">  <div id="animal-nome"><span>' + minha_carta.nome + '</span></div>  <div id="animal-imagem"><img src="' + minha_carta.imagem + '"  alt="imagem do animal" /></div>  <div class="animal-info">  <div class="menos" onClick="selecionarItem(-1,' + minha_carta.vida + ",'vida'" + ')">  <span>-</span>  </div>  <div id="vida-animal"><span>Vida: ' + minha_carta.vida + ' anos</span></div>  <div class="mais" onClick="selecionarItem(1,' + minha_carta.vida + ",'vida'" + ')">  <span>+</span>  </div>  </div>  <div class="animal-info">  <div class="menos"  onClick="selecionarItem(-1,' + minha_carta.velocidade + ",'velocidade'" + ')">  <span>-</span>  </div>  <div id="velocidade-animal"><span>Velocidade: ' + minha_carta.velocidade + 'km/h</span></div>  <div class="mais" onClick="selecionarItem(1,' + minha_carta.velocidade + ",'velocidade'" + ')">  <span>+</span>  </div>  </div>  <div class="animal-info">  <div class="menos"  onClick="selecionarItem(-1,' + minha_carta.peso + ",'peso'" + ')">  <span>-</span>  </div>  <div id="peso-animal"><span>Peso: ' + minha_carta.peso + 'kg</span></div>  <div class="mais"  onClick="selecionarItem(1,' + minha_carta.peso + ",'peso'" + ')">  <span>+</span>  </div>  </div>  <div class="animal-info">  <div class="menos"  onClick="selecionarItem(-1,' + minha_carta.tamanho + ",'tamanho'" + ')">  <span>-</span>  </div>  <div id="tamanho-animal"><span>Tamanho: ' + minha_carta.tamanho + 'm</span></div>  <div class="mais" onClick="selecionarItem(1,' + minha_carta.tamanho + ",'tamanho'" + ')">  <span>+</span>  </div>  </div>  </div>  </div>  </div>  <div class="area2">  <div class="partida-info"><span>Escolhido ' + tipo_categoria + ' como ' + ((tipo_selecao === 1) ? 'maior' : 'menor') + ' valor</span></div>  <div class="partida-cards">  <div class="card-user">  <div class="placar">  <h3>' + minha_pontuacao + '</h3>  </div>  <div class="carta-selecionada">  <div class="nome-selecionado"><span>' + minha_carta.nome + '</span></div>  <div class="imagem-selecionada"><img  src="' + minha_carta.imagem + '" alt="imagem do animal" />  </div>  <div class="atributo-selecionado"><span>' + aux_valor_meu_animal + '</span></div>  </div>  </div>  <div class="card-adversario">  <div class="placar">  <h3>' + adversario_pontuacao + '</h3>  </div>  <div class="carta-selecionada" style="opacity: 0;">   </div>  </div>  </div>  </div>  <div class="area3">  <div class="player-title">  <span>Adversário</span>  </div>  <div class="player-info">  <div id="nome-adversario"><span>' + adversario.name.first + ' ' + adversario.name.last + '</span></div>  <div id="imagem-adversario">  <img src="' + adversario.picture.large + '" alt="imagem do adversário" />  </div>  <div id="cidade-adversario"><span>Cidade: ' + adversario.location.city + '</span></div>  <div id="idade-adversario"><span>Idade: ' + adversario.dob.age + ' anos</span></div>  </div>  </div>'
    updateBotoes(0, 1, 1, 1);
    areaBoardHtml.innerHTML = '';
    areaBoardHtml.innerHTML += content;
  }
  else if (step_do_jogo === 3) {
    let aviso;
    let minha_carta = lista_animais.find(item => item.nome === minhas_cartas_em_jogo[0].nome);
    minhas_cartas_em_jogo.shift();
    let adversario_carta = lista_animais.find(item => item.nome === adversario_cartas_em_jogo[0].nome);
    adversario_cartas_em_jogo.shift();
    let valor_adversario_animal;
    console.log('carta atual: ');
    console.log(minha_carta);
    let aux_valor_meu_animal;
    let aux_valor_adversario_animal;
    if (tipo_categoria === 'vida') {
      aux_valor_meu_animal = 'Vida: ' + valor_meu_animal + ' anos';
      valor_adversario_animal = adversario_carta.vida;
      aux_valor_adversario_animal = 'Vida: ' + valor_adversario_animal + ' anos';
    } else if (tipo_categoria === 'velocidade') {
      aux_valor_meu_animal = 'Velocidade: ' + valor_meu_animal + 'km/h';
      valor_adversario_animal = adversario_carta.velocidade;
      aux_valor_adversario_animal = 'Velocidade: ' + valor_adversario_animal + 'km/h';
    } else if (tipo_categoria === 'peso') {
      aux_valor_meu_animal = 'Peso: ' + valor_meu_animal + 'kg';
      valor_adversario_animal = adversario_carta.peso;
      aux_valor_adversario_animal = 'Peso: ' + valor_adversario_animal + 'kg';
    } else if (tipo_categoria === 'tamanho') {
      aux_valor_meu_animal = 'Tamanho: ' + valor_meu_animal + 'm';
      valor_adversario_animal = adversario_carta.tamanho;
      aux_valor_adversario_animal = 'Tamanho: ' + valor_adversario_animal + 'm';
    }
    if (tipo_selecao === 1) {
      if (valor_meu_animal > valor_adversario_animal) {
        minha_pontuacao++;
        aviso = 'Você ganhou por maior ' + tipo_categoria;
      } else if (valor_adversario_animal > valor_meu_animal) {
        adversario_pontuacao++;
        aviso = 'Adversário ganhou por maior ' + tipo_categoria;
      } else {
        aviso = "Empate!"
      }
    } else {
      if (valor_meu_animal < valor_adversario_animal) {
        minha_pontuacao++;
        aviso = 'Você ganhou por menor ' + tipo_categoria;
      } else if (valor_adversario_animal < valor_meu_animal) {
        adversario_pontuacao++;
        aviso = 'Adversário ganhou por menor ' + tipo_categoria;
      } else {
        aviso = "Empate!"
      }
    }
    let areaBoardHtml = document.getElementById('area-board');
    let content = '<div class="area1">  <div class="player-title">  <span>Carta Atual</span>  </div>  <div class="player-info">  <div class="animal-deck">  <div id="animal-nome"><span>' + minha_carta.nome + '</span></div>  <div id="animal-imagem"><img src="' + minha_carta.imagem + '"  alt="imagem do animal" /></div>  <div class="animal-info">  <div></div>  <div id="vida-animal"><span>Vida: ' + minha_carta.vida + ' anos</span></div>  <div></div>  </div>  <div class="animal-info">  <div></div>  <div id="velocidade-animal"><span>Velocidade: ' + minha_carta.velocidade + 'km/h</span></div>  <div></div>  </div>  <div class="animal-info">  <div> </div>  <div id="peso-animal"><span>Peso: ' + minha_carta.peso + 'kg</span></div>  <div></div>  </div>  <div class="animal-info">  <div > </div>  <div id="tamanho-animal"><span>Tamanho: ' + minha_carta.tamanho + 'm</span></div>  <div > </div>  </div>  </div>  </div>  </div>  <div class="area2">  <div class="partida-info"><span>' + aviso + '</span></div>  <div class="partida-cards">  <div class="card-user">  <div class="placar">  <h3>' + minha_pontuacao + '</h3>  </div>  <div class="carta-selecionada">  <div class="nome-selecionado"><span>' + minha_carta.nome + '</span></div>  <div class="imagem-selecionada"><img  src="' + minha_carta.imagem + '" alt="imagem do animal" />  </div>  <div class="atributo-selecionado"><span>' + aux_valor_meu_animal + '</span></div>  </div>  </div>  <div class="card-adversario">  <div class="placar">  <h3>' + adversario_pontuacao + '</h3>  </div>  <div class="carta-selecionada">  <div class="nome-selecionado"><span>' + adversario_carta.nome + '</span></div>  <div class="imagem-selecionada"><img  src="' + adversario_carta.imagem + '" alt="imagem do animal" />  </div>  <div class="atributo-selecionado"><span>' + aux_valor_adversario_animal + '</span></div>  </div>  </div>  </div>  </div>  <div class="area3">  <div class="player-title">  <span>Adversário</span>  </div>  <div class="player-info">  <div id="nome-adversario"><span>' + adversario.name.first + ' ' + adversario.name.last + '</span></div>  <div id="imagem-adversario">  <img src="' + adversario.picture.large + '" alt="imagem do adversário" />  </div>  <div id="cidade-adversario"><span>Cidade: ' + adversario.location.city + '</span></div>  <div id="idade-adversario"><span>Idade: ' + adversario.dob.age + ' anos</span></div>  </div>  </div>'
    updateBotoes(0, 1, 1, 1);
    areaBoardHtml.innerHTML = '';
    areaBoardHtml.innerHTML += content;
  }

  else if (step_do_jogo === 4) {

    let aviso;
    let minha_carta = lista_animais.find(item => item.nome === minhas_cartas_em_jogo[0].nome);

    tipo_selecao = 1;
    tipo_categoria = 'vida';
    let myRanking = calculaRankingCard(tipo_selecao,tipo_categoria, adversario_cartas_em_jogo[0].nome);

    let aux_tipos = [-1, 1];
    let aux_categorias = ['vida', 'velocidade', 'peso', 'tamanho'];
    for (let i = 0; i<aux_tipos.length; i++ ) {
      for (let j = 0; j<aux_categorias.length; j++) {
        console.log ('for i ' + i + ' , j ' + j);
        let currRanking = calculaRankingCard(aux_tipos[i],aux_categorias[j],adversario_cartas_em_jogo[0].nome);
        if (currRanking < myRanking) {
          myRanking = currRanking;
          tipo_selecao = aux_tipos[i];
          tipo_categoria = aux_categorias[j];
        }
      }
    }

    /* tipo_selecao = [-1, 1].sample();
    tipo_categoria = ['vida', 'velocidade', 'peso', 'tamanho'].sample(); */

    if (tipo_categoria === 'vida') {
      valor_meu_animal = minha_carta.vida;
    } else if (tipo_categoria === 'velocidade') {
      valor_meu_animal = minha_carta.velocidade;
    } else if (tipo_categoria === 'peso') {
      valor_meu_animal = minha_carta.peso;
    } else if (tipo_categoria === 'tamanho') {
      valor_meu_animal = minha_carta.tamanho;
    }

    aviso = 'Vez do adversário - Item escolhido: ' + ((tipo_selecao === 1) ? 'maior ' : 'menor ') + tipo_categoria;
    let valor_adversario_animal;
    console.log('carta atual: ');
    console.log(minha_carta);
    let aux_valor_meu_animal;
    let aux_valor_adversario_animal;

    let areaBoardHtml = document.getElementById('area-board');
    let content = '<div class="area1">  <div class="player-title">  <span>Carta Atual</span>  </div>  <div class="player-info">  <div class="animal-deck">  <div id="animal-nome"><span>' + minha_carta.nome + '</span></div>  <div id="animal-imagem"><img src="' + minha_carta.imagem + '"  alt="imagem do animal" /></div>  <div class="animal-info">  <div></div>  <div id="vida-animal"><span>Vida: ' + minha_carta.vida + ' anos</span></div>  <div></div>  </div>  <div class="animal-info">  <div></div>  <div id="velocidade-animal"><span>Velocidade: ' + minha_carta.velocidade + 'km/h</span></div>  <div></div>  </div>  <div class="animal-info">  <div> </div>  <div id="peso-animal"><span>Peso: ' + minha_carta.peso + 'kg</span></div>  <div></div>  </div>  <div class="animal-info">  <div > </div>  <div id="tamanho-animal"><span>Tamanho: ' + minha_carta.tamanho + 'm</span></div>  <div > </div>  </div>  </div>  </div>  </div>  <div class="area2">  <div class="partida-info"><span>' + aviso + '</span></div>  <div class="partida-cards">  <div class="card-user">  <div class="placar">  <h3>' + minha_pontuacao + '</h3>  </div>  <div class="carta-selecionada" style="opacity: 0;">   </div>  </div>  <div class="card-adversario">  <div class="placar">  <h3>' + adversario_pontuacao + '</h3>  </div>  <div class="carta-selecionada" style="opacity: 0;">  </div>  </div>  </div>  </div>  <div class="area3">  <div class="player-title">  <span>Adversário</span>  </div>  <div class="player-info">  <div id="nome-adversario"><span>' + adversario.name.first + ' ' + adversario.name.last + '</span></div>  <div id="imagem-adversario">  <img src="' + adversario.picture.large + '" alt="imagem do adversário" />  </div>  <div id="cidade-adversario"><span>Cidade: ' + adversario.location.city + '</span></div>  <div id="idade-adversario"><span>Idade: ' + adversario.dob.age + ' anos</span></div>  </div>  </div>'
    updateBotoes(0, 1, 1, 1);
    areaBoardHtml.innerHTML = '';
    areaBoardHtml.innerHTML += content;
  }
  else if (step_do_jogo === 5) {

    let aviso;

    if (adversario_pontuacao < minha_pontuacao) {
      aviso = 'FIM DA PARTIDA - Resultado final: VOCÊ GANHOU!'
    }
    else if (adversario_pontuacao > minha_pontuacao) {
      aviso = 'FIM DA PARTIDA - Resultado final: você perdeu'
    }
    else {
      aviso = 'FIM DA PARTIDA - Resultado final: EMPATE'
    }

    let areaBoardHtml = document.getElementById('area-board');
    let content = '<div class="area1">  <div class="player-title">  <span></span>  </div>  <div class="player-info">  <div > </div>  </div>  </div>  <div class="area2">  <div class="partida-info"><span>' + aviso + '</span></div>  <div class="partida-cards">  <div class="card-user">  <div class="placar">  <h3>' + minha_pontuacao + '</h3>  </div>  <div class="carta-selecionada" style="opacity: 0;">   </div>  </div>  <div class="card-adversario">  <div class="placar">  <h3>' + adversario_pontuacao + '</h3>  </div>  <div class="carta-selecionada" style="opacity: 0;">  </div>  </div>  </div>  </div>  <div class="area3">  <div class="player-title">  <span>Adversário</span>  </div>  <div class="player-info">  <div id="nome-adversario"><span>' + adversario.name.first + ' ' + adversario.name.last + '</span></div>  <div id="imagem-adversario">  <img src="' + adversario.picture.large + '" alt="imagem do adversário" />  </div>  <div id="cidade-adversario"><span>Cidade: ' + adversario.location.city + '</span></div>  <div id="idade-adversario"><span>Idade: ' + adversario.dob.age + ' anos</span></div>  </div>  </div>'
    updateBotoes(1, 0, 0, 1);
    areaBoardHtml.innerHTML = '';
    areaBoardHtml.innerHTML += content;
  }
}


const selecionarItem = (tipo, valor, categoria) => {
  console.log(tipo);
  console.log(valor);
  console.log(categoria);
  step_do_jogo = 2;
  tipo_selecao = tipo;
  valor_meu_animal = valor;
  tipo_categoria = categoria;
  atualizarBoard();
}

const comecarJogo = async () => {
  console.log(adversario);
  minhas_cartas_em_jogo = [];
  while (minhas_cartas_em_jogo.length < 6) {
    let card = meus_animais.sample();
    console.log('card')
    console.log(card)
    if (!minhas_cartas_em_jogo.some((animal) => { return animal.nome === card.nome; })) {
      minhas_cartas_em_jogo.push(card);
    }

    console.log('minhas_cartas_em_jogo')
    console.log(minhas_cartas_em_jogo)
  }

  adversario_cartas_em_jogo = [];
  while (adversario_cartas_em_jogo.length < 6) {
    let card = lista_animais.slice(0, 20).sample();
    if (!adversario_cartas_em_jogo.some((animal) => { return animal.nome === card.nome; })) {
      adversario_cartas_em_jogo.push(card);
    }
  }
  rodada = 1;
  minha_pontuacao = 0;
  adversario_pontuacao = 0;
  step_do_jogo = 1;

  atualizarBoard();
}

