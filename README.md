# Arcane Horder 2.1 — Visual Identity Update

Versão expandida do Arcane Horder 2.0, mantendo HTML/CSS/JavaScript puro, Canvas API e localStorage. Não requer Node.js, backend ou bibliotecas externas para jogar.

## Executar

Use um servidor local (por exemplo Live Server no VS Code) e abra `index.html`.

Também é compatível com GitHub Pages. Preserve exatamente a estrutura de pastas ao publicar.

## Controles

- Movimento: WASD ou setas
- Pause: ESC
- Ataques: automáticos

## Novidades da 2.1

### Movimento rebalanceado

A velocidade base de todas as classes foi reduzida em aproximadamente 20%, mantendo resposta imediata ao input:

- Mago: 212 → 170
- Arqueiro: 238 → 190
- Necromante: 208 → 166
- Cavaleiro Arcano: 190 → 152
- Druida: 214 → 171
- Assassino: 270 → 216

`Botas Arcanas` agora concede +8% de velocidade por nível. O jogador possui um teto de velocidade de aproximadamente 142% da velocidade base da classe para impedir builds que removam o desafio de posicionamento.

O bônus temporário de relíquias ainda pode ultrapassar levemente esse teto, mas não de forma permanente.

Também foi corrigido um bug em elites Congelantes: o slow não altera mais permanentemente `player.speed`; agora utiliza um temporizador de lentidão.

### Habilidades com identidade visual própria

O antigo renderer genérico de projéteis circulares foi substituído por `js/visuals/abilityVisuals.js`.

As formas principais continuam visíveis até na qualidade Baixa. A configuração de qualidade altera apenas detalhes, glow, ramificações e quantidade de partículas.

Exemplos:

- Bola de Fogo: núcleo irregular, chama traseira e brasas.
- Sol Carmesim: pequeno sol com raios e anel energético.
- Flecha: haste, ponta e penas.
- Fragmento de Gelo: cristal alongado e pontudo.
- Machado: cabo + lâmina giratória.
- Bumerangue: silhueta curva giratória.
- Flecha Venenosa: gota tóxica irregular com bolhas.
- Lança Sagrada: lança longa com ponta luminosa.
- Lâmina de Vento: corte curvo de ar.
- Adaga Sombria: lâmina + cabo apontando para a direção de voo.
- Olho Divino: projétil sagrado com formato de olho/lâmina.
- Raio/Tempestade: linhas elétricas irregulares e ramificações.
- Nova de Gelo: anel expansivo com cristais na borda.
- Espinhos Vivos: espinhos radiais surgindo do chão.
- Meteoro: indicador de impacto + rocha em chamas + rastro.
- Espinho de Pedra: pilares reais de rocha.
- Erupção Vulcânica: rachaduras e coluna de magma.
- Escudo Giratório: escudos com silhueta própria.
- Bastião Eterno: escudos rúnicos dourados.
- Esqueletos: corpo desenhado com crânio e ossos, não círculos.
- Undead Conductor: esqueletos eletrificados com correntes visíveis.
- Aura Arcana: anel rúnico.
- Aura da Morte: círculo profano + almas espectrais.
- Tempestade Congelante: campo glacial com borda cristalina.
- Jardim da Praga: vinhas e folhas tóxicas.
- Tornado de Chamas: espiral flamejante realmente giratória.
- Cadáveres Tóxicos: névoa/almas tóxicas com caveiras.
- Thermal Collapse: congelamento visual seguido de explosão térmica.

### Partículas por elemento

Partículas agora possuem formas diferentes:

- Fogo: brasas/faíscas.
- Gelo: pequenos cristais.
- Elétrico: micro-raios.
- Veneno/Natureza: gotas/bolhas.
- Sombra: almas/fumaça.
- Arcano/Sagrado: runas/fragmentos.
- Vento: cortes curvos.
- Terra: fragmentos triangulares.
- Físico: faíscas/linhas de impacto.

### Qualidade dos efeitos

Em Configurações existe:

- Baixa: forma completa das habilidades + poucas partículas.
- Média: detalhes e partículas equilibrados.
- Alta: glow, ramificações e quantidade completa de efeitos.

O slider de Partículas continua existindo e pode zerar partículas extras sem remover a silhueta principal das habilidades.

## Sistemas mantidos da 2.0

- Curva de HP inimigo por tempo + dificuldade.
- Dificuldades Normal, Difícil, Pesadelo e Arcano.
- XP necessário: `75 + 25 * level^1.55`.
- 6 classes e 6 biomas.
- Inimigos especiais, elites e modificadores.
- Minibosses em 4, 8, 12 e 16 minutos; Arcane Titan aos 20 minutos.
- Level up com 4 opções, Reroll, Banish e Skip.
- Evoluções substituem a habilidade original no mesmo slot.
- Arcane Fusion remove as habilidades-base e cria uma habilidade Arcana.
- Invocações rápidas com reacquire, catch-up e teleporte de segurança.
- Relíquias, baús, altares, mercadores, desafios, portais e eventos amaldiçoados.
- Conquistas, Run Summary e Damage Breakdown.
- Object pooling para projéteis e partículas.
- Migração automática de save antigo.

## Arquivo visual principal novo

```text
js/visuals/abilityVisuals.js
```

Esse módulo concentra o desenho das habilidades, mantendo `game.js` focado em lógica e evitando uma nova refatoração gigante.

## Validação

- Todos os `.js` passaram em `node --check`.
- `game.js` importa corretamente.
- Smoke test de movimento: aprovado.
- Velocidade reduzida e speed cap: aprovados.
- Slow temporário sem modificar atributo permanente: aprovado.
- Spawn de Fireball e renderer: aprovado.
- Nova de Gelo cria efeito expansivo: aprovado.
- Renderer de todos os tipos visuais principais: aprovado em teste simulado.

Para validação visual final, abra no Live Server/GitHub Pages e alterne entre Baixa/Média/Alta durante uma partida.
