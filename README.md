# Arcane Horder 2.8.0 — Signature Abilities & Arcane Grimoire

Atualização integrada sobre a linha 2.7, preservando boss a cada 2 minutos, Fusion Lv.1–14, Fusion Items, minimapa, eventos, regeneração, biomas, relíquias, elites, evoluções automáticas e hordas.

## Identidade das 14 classes
Cada classe começa com uma **Signature Ability exclusiva**, que não entra na pool normal de outras classes e não pode ser banida. Todas vão do Lv.1 ao Lv.5 e evoluem automaticamente:

- Mago — Rune Barrage → Archmage Circle
- Necromante — Bone Covenant → Bone Colossus
- Arqueiro — Hunter's Volley → Thousand Arrows
- Cavaleiro Arcano — Arcane Blade → King's Arcane Edge
- Druida — Living Thorns → World Roots
- Assassino — Shadow Knives → Nightmare Blades
- Warlock — Abyssal Sigil → Gate of the Abyss
- Paladino — Sacred Wave → Divine Crusade
- Elementalista — Primal Core → Elemental Singularity
- Mago de Batalha — Arcane Greatsword → Spellbreaker
- Invocador — Celestial Light → Celestial Star
- Mago Sanguíneo — Blood Lances → Crimson Cathedral
- Monge Arcano — Ki Fists → Thousand Arms
- Tecnômante — Arcane Drones → Arcane Satellite

As pools gerais continuam abertas, mas recebem pesos temáticos por classe.

## Arcane Grimoire
O menu principal e o menu de pausa agora dão acesso ao guia integrado com:

- abas Habilidades, Evoluções, Fusions, Itens de Fusão e Descobertas;
- busca por Fusion, habilidade, item, classe ou elemento;
- filtros por descoberta, item, classe, elemental, summon e Arcane;
- modo DESCOBERTA ou MOSTRAR TODAS;
- receitas geradas diretamente de `FUSION_RECIPES`;
- requisitos atuais da run e progresso de habilidades ainda não evoluídas;
- botão RASTREAR FUSION;
- tracker na HUD;
- destaque no minimapa quando o boss relacionado ao item rastreado aparece;
- progressão completa Lv.1–14 das Fusions descobertas;
- descobertas permanentes separadas do progresso temporário da run.

## Itens
- 18 Run Items: Common, Rare, Epic, Legendary e Cursed.
- 17 Fusion Items.
- Novos catalisadores incluem Fragmento Solar, Olho Abissal, Semente Primordial, Escama de Dragão, Engrenagem Arcana, Pedra Lunar e Coroa Arcana.
- Bosses concedem item de run diretamente; elites possuem pequena chance de item direto.
- Baús de elite ficaram mais raros: 11% de chance, mas as recompensas dos baús foram fortalecidas.

## Hordas
- Cap dinâmico normal: até 430 inimigos conforme tempo/dificuldade.
- Modo performance: até 250.
- Grupos maiores e intervalos menores conforme a run avança.
- Horde Surges continuam ativos.
- Arqueiro Ósseo é a exceção: cap próprio 2 / 4 / 6 / 7 e no máximo um novo por grupo.

## Totais
- 14 classes
- 14 Signature Abilities
- 42 habilidades-base no arsenal total
- 42 evoluções automáticas
- 49 Arcane Fusions
- 17 Fusion Items
- 18 Run Items
- Fusions até Lv.14

## Validação
Todos os módulos JavaScript foram verificados por sintaxe e os testes automatizados do projeto passaram. A tentativa de abrir o jogo em Chromium headless pelo ambiente não concluiu por restrições do navegador/ambiente, portanto a validação visual/manual final continua sendo feita melhor ao abrir o projeto no navegador/GitHub Pages.
