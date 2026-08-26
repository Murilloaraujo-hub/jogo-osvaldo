# Arcane Horder 2.0 — Arcane Fusion Update

Versão expandida do projeto original, mantendo HTML/CSS/JavaScript puro, Canvas API e localStorage. Não requer Node.js, backend ou bibliotecas externas para jogar.

## Executar

Use um servidor local (por exemplo Live Server no VS Code) e abra `index.html`.

Também é compatível com GitHub Pages. Preserve exatamente a estrutura de pastas ao publicar.

## Controles

- Movimento: WASD ou setas
- Pause: ESC
- Ataques: automáticos

## Principais sistemas da 2.0

- Curva de HP inimigo por tempo + dificuldade.
- Dificuldades Normal, Difícil, Pesadelo e Arcano.
- XP necessário: `75 + 25 * level^1.55` (aproximado para 100, 148, 212, 378, 962, 1738, 2672 nos níveis 1/2/3/5/10/15/20).
- 6 classes: Mago, Arqueiro, Necromante, Cavaleiro Arcano, Druida e Assassino.
- 6 biomas desbloqueáveis.
- Inimigos rápidos, tanques, atiradores, magos, invocadores, explosivos e elites.
- Modificadores de elite aleatórios.
- Minibosses em 4, 8, 12 e 16 minutos; Arcane Titan aos 20 minutos.
- Level up com 4 opções, Reroll, Banish e Skip.
- Raridades Comum, Raro, Épico, Lendário e Arcano.
- Evoluções reais substituem a habilidade original no mesmo slot.
- Arcane Fusion combina e remove as habilidades-base para criar uma habilidade Arcana.
- Invocações bem mais rápidas, com reacquire de alvo, catch-up e teleporte de segurança.
- Relíquias com efeitos de gameplay.
- Baús de cinco raridades.
- Altares, mercadores, desafios, portais e eventos amaldiçoados.
- Conquistas e recompensas permanentes.
- Run Summary com damage breakdown.
- Object pooling para projéteis e partículas.
- Migração automática do save 1.x para saveVersion 2.

## Evoluções

- Sol Carmesim — Bola de Fogo + Selo da Força
- Tempestade Congelante — Gelo + Raio
- Legião Amaldiçoada — Esqueleto + Aura da Morte
- Olho Divino — Arco + crítico
- Bastião Eterno — Escudo + Espada + armadura
- Jardim da Praga — Espinhos + Veneno

## Arcane Fusions

- THERMAL COLLAPSE — Bola de Fogo + Nova de Gelo + Núcleo Elemental
- UNDEAD CONDUCTOR — Esqueleto + Raio + Códice Profano
- TORNADO DE CHAMAS — Bola de Fogo + Lâmina de Vento + Núcleo Elemental
- CADÁVERES TÓXICOS — Veneno + Aura da Morte + Códice Profano
- ERUPÇÃO VULCÂNICA — Fogo + Terra + Núcleo Elemental

## Validação realizada

- `node --check` em todos os módulos JavaScript: aprovado.
- Importação e inicialização do `Game` em ambiente simulado: aprovado.
- Movimento: aprovado.
- Curva de XP: aprovada.
- Curva de HP por tempo/dificuldade: aprovada.
- Level-up e geração de 4 opções: aprovado.
- Substituição de evolução: habilidade antiga removida e evolução inserida no slot: aprovado.
- Arcane Fusion: duas bases removidas e fusão inserida: aprovado.
- Esqueletos: perseguição, reacquire e catch-up: aprovado.
- Comportamentos de todos os tipos de inimigo: sem exceções no smoke test.
- Migração de save antigo: moedas, desbloqueios, configurações e evoluções preservados.
- Referências `getElementById` verificadas contra o `index.html`: nenhuma referência ausente.

Para testes em navegador, use Live Server ou GitHub Pages e abra o Console (F12). O projeto foi estruturado para reportar erros de carregamento no próprio menu sem deixar os botões mortos.
