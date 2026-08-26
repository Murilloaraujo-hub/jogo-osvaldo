# Arcane Horder 2.4.0 — Navigation, Big Hordes & Class Redesign

Esta versão parte diretamente da 2.3.0 e preserva passivas de classe, regeneração universal, evolução automática no Nv.5, Arcane Fusion, relíquias, eventos, inimigos redesenhados, hitboxes separadas, bosses, minibosses, elites e saves existentes.

## Correção principal do minimapa

A causa do minimapa quase preto foi identificada: a implementação anterior calculava a escala usando `g.worldWidth` e `g.worldHeight`, mas essas propriedades não existiam no objeto `Game`. O resultado era escala `NaN`; o fundo escuro era desenhado, enquanto terreno/obstáculos/marcadores ficavam sem coordenadas válidas.

O minimapa foi refeito como radar de navegação local:

- terreno simplificado visível, sem fundo preto dominante;
- caminhos, água/lava/gelo, obstáculos grandes e pontos de interesse;
- seta do jogador com direção;
- baús, eventos, altares, mercadores, portais, elites, minibosses e bosses;
- marcadores importantes fora do alcance aparecem na borda apontando a direção;
- boss/eventos importantes também recebem seta na tela com distância aproximada;
- marcadores usam os mesmos arrays do mundo e desaparecem quando a entidade deixa de existir.

## Mapas repaginados

Todos os seis biomas agora geram composição determinística por seed com:

- 9 rotas/trilhas por mapa;
- 6 pontos de interesse reconhecíveis;
- lagos/poças/lava/gelo/energia conforme o bioma;
- regiões de terreno com variação de tonalidade;
- clusters decorativos;
- sombras em objetos grandes;
- ruínas, pilares, árvores, pedras e cristais;
- áreas abertas para combate;
- obstáculos evitando as rotas principais;
- copa de árvores/partes altas ficam semitransparentes quando próximas do jogador.

## Hordas

O spawn deixou de ser predominantemente unitário e passou a usar grupos com composição por função.

- início já possui pressão maior;
- grupos ficam maiores progressivamente;
- composição mistura básicos, rápidos, ranged, tanques e especiais;
- limite dinâmico cresce com o tempo e considera modo performance/dificuldade;
- eventos periódicos mostram `HORDA SE APROXIMANDO` e aumentam temporariamente a densidade;
- spawn procura área livre e evita obstáculos/água bloqueada;
- spawn mantém distância mínima do jogador;
- direções são distribuídas ao redor do personagem.

## HP base 2.4.0

| Classe | HP |
|---|---:|
| Mago | 125 |
| Arqueiro | 135 |
| Necromante | 130 |
| Cavaleiro Arcano | 205 |
| Druida | 155 |
| Assassino | 114 |

A regeneração anterior foi preservada: **+3 HP a cada 2 segundos**, limitada ao HP máximo.

## Redesign das classes

Novo módulo: `js/visuals/playerVisuals.js`.

- **Mago:** túnica, chapéu torto detalhado, runa e grimório flutuante; grimório reage ao Laser Rúnico.
- **Necromante:** capuz, manto, coroa óssea e cajado com crânio, com detalhes espectrais.
- **Arqueiro:** capuz, arco visível, aljava e flechas.
- **Cavaleiro Arcano:** armadura, capacete, viseira, espada, escudo rúnico e resposta visual da Guarda Arcana.
- **Druida:** roupa natural, cajado de galhos, folhas e coroa/galhadas vegetais.
- **Assassino:** capuz, máscara, corpo estreito, duas adagas e sombra de movimento.

Acessórios são apenas visuais. A hitbox real do jogador continua separada (`hitboxRadius`) e não aumenta por causa de chapéu, espada, arco, escudo, grimório ou cajado.

## Instalação no GitHub Pages

Extraia o ZIP e substitua o conteúdo do repositório, mantendo `index.html`, `css/` e `js/` na raiz. Todos os imports locais usam cache-busting `?v=2.4.0`.

A confirmação visual da versão é o rodapé:

`v2.4.0 • NAVIGATION • BIG HORDES • CLASS REDESIGN`
