# Arcane Horder 2.3.0 — Class Passives & Living World

Esta versão foi construída sobre a 2.2.0 e preserva os sistemas anteriores de combate, inimigos, elites, chefes, relíquias, Arcane Fusions, raridades, baús, eventos, hitboxes e save.

## Principais sistemas adicionados

### Passivas exclusivas das classes
- **Mago — Laser Rúnico:** a cada 5 s prepara por 0,3 s e dispara um feixe perfurante.
- **Necromante — Exército dos Caídos:** mortes feitas por esqueletos normais são registradas; a cada 30 s até 8–24 criaturas retornam por 20 s como aliados espectrais.
- **Arqueiro — Chuva do Caçador:** a cada 7 s marca uma região por 0,5 s e faz chover flechas visíveis.
- **Cavaleiro Arcano — Guarda Arcana:** a cada 8 s cria barreira por 2 s, reduz dano, empurra e explode.
- **Druida — Ira da Natureza:** a cada 8 s raízes surgem em uma concentração de inimigos, causam dano e controle.
- **Assassino — Passo Sombrio:** a cada 6 s uma projeção sombria ataca automaticamente um alvo relevante sem mover o jogador.

As passivas não ocupam slots de habilidade e possuem indicador próprio na HUD.

### Regeneração universal
Todas as classes recuperam **3 HP a cada 2 segundos** pelo game loop. Não usa `setInterval`, não duplica ao reiniciar e nunca ultrapassa o HP máximo.

### Evolução automática no Nv.5
As habilidades com evolução direta evoluem imediatamente ao chegar ao Nv.5 e a forma original é removida do slot.

Evoluções automáticas atuais:
- Bola de Fogo → Sol Carmesim
- Fragmentos de Gelo → Tempestade Congelante
- Esqueleto Guerreiro → Legião Amaldiçoada
- Arco → Olho Divino
- Escudo Giratório → Bastião Eterno
- Espinhos Vivos → Jardim da Praga

As Arcane Fusions foram ajustadas para reconhecer as formas evoluídas, evitando depender de IDs já removidos.

### Minimapa funcional
Minimapa no canto superior direito mostrando:
- jogador e direção;
- limites do mapa;
- obstáculos importantes;
- baús;
- eventos;
- altares;
- mercadores;
- portais;
- elites;
- minibosses;
- boss final.

Configurações novas:
- Minimapa ON/OFF;
- tamanho Pequeno/Médio/Grande.

O minimapa é atualizado em frequência reduzida para preservar FPS.

### Mundo e biomas
Foi criado `js/world/worldMap.js`, com geração determinística por bioma, culling e obstáculos reais.

Os mapas agora possuem textura e objetos próprios, incluindo combinações de:
- árvores e raízes;
- pedras e pilares;
- ruínas e destroços;
- runas e cristais;
- ossos e marcas no terreno;
- neve e rachaduras de gelo;
- lagos congelados;
- vegetação e cogumelos;
- fissuras arcanas.

Obstáculos possuem hitbox própria, separada da parte decorativa. O modo **Mostrar hitboxes** também exibe hitboxes ambientais.

## Arquivos novos
- `js/systems/classPassives.js`
- `js/systems/minimap.js`
- `js/world/worldMap.js`

## Arquivos principais modificados
- `index.html`
- `css/style.css`
- `js/main.js`
- `js/config.js`
- `js/game.js`
- `js/save.js`
- `js/evolutions.js`
- `js/entities/player.js`
- `js/ui/menus.js`

## Save
O save foi migrado para versão 3 sem trocar a chave de `localStorage`, preservando dados antigos. Configurações novas recebem valores padrão automaticamente.

## Build
No menu deve aparecer:

`v2.3.0 • CLASS PASSIVES • MINIMAP • LIVING BIOMES`
