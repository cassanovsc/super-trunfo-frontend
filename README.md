# Frontend - Super Trunfo

Neste projeto foi desenvolvido uma interface de uma adaptação do jogo Super-Trunfo, onde o usuário joga com outro jogador fictício para conquistar novas cartas.
O tema das cartas é "Animais" e o objetivo é conquistar todas as 21 cartas existentes.

Além da utilização das tecnologias HTML, CSS e Javascript, é feita a integração com as seguintes API:
* [Random User API](https://randomuser.me/api/) - API externa que gerar informações aleátorias de usuários
* [Catálogo de Animais API](https://https://github.com/cassanovsc/catalogo-animais-api) - API própria onde é possível obter uma lista de animais com as informações: Nome, Imagem, Vida (média), Velocidade (média), Tamanho (médio) e Peso (médio)
* [Tema & Itens API](https://https://github.com/cassanovsc/tema-itens-api) - API própria de generalização de Chave - Valores, onde um Tema (chave) pode possuir vários Itens (valores). Nessa API é possível realizar todas as operações de CRUD tanto nos Temas quanto nos seus Itens e portanto foi utilizada para salvar no Tema "Animais" todos os Itens (por exemplo "Sapo" e "Leão") conquistados pelo usuário do frontend Super Trunfo.

O objetivo aqui é mostrar parte do aprendizado adquirido ao longo do Curso de Pós Graduação em Desenvolvimento Full Stack da PUC Rio.

---
### Como executar

Basta fazer o download do projeto e abrir o arquivo index.html no seu browser.
O servidor local das APIs "Catálogo de Animais API" e "Tema & Itens API" devem estar em execução.

