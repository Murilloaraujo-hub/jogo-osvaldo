# Arcane Horder 2.2 — Enemy Identity Update

Versão completa do Arcane Horder em HTML, CSS e JavaScript puro com Canvas API e `localStorage`.

## Principais mudanças da 2.2

### Inimigos redesenhados

Os inimigos não são mais círculos genéricos. O novo módulo:

```text
js/visuals/enemyVisuals.js
```

desenha cada família com silhueta e animação próprias:

- Slime Corrompido: corpo viscoso com wobble.
- Goblin Arcano: cabeça, orelhas e arma.
- Esqueleto Errante: crânio, costelas e membros.
- Morcego Sombrio: asas animadas.
- Orc Blindado: corpo largo e placas.
- Mago Sombrio: manto, cajado e runa.
- Arqueiro Ósseo: esqueleto com arco.
- Ímpeto Explosivo: corpo instável com rachaduras.
- Invocador Abissal: manto ritual e orbes.
- Golem de Pedra: blocos e placas de rocha.
- Ogro Rúnico, Lich, Guardião, Fera Carmesim e Arcane Titan possuem desenhos próprios.

Elites também mostram visualmente modificadores como Flamejante, Congelante, Eletrificado, Vampírico, Blindado e Veloz.

### Hitboxes justas

O visual e a colisão agora são separados.

Cada inimigo pode possuir:

```text
visualSize
hitboxRadius
hitboxOffsetX
hitboxOffsetY
separationRadius
```

Chifres, armas, asas, capas e auras não aumentam injustamente a área de contato.

O jogador também possui uma hitbox real menor que o círculo visual.

### Debug de hitbox

Em **Configurações** existe:

```text
Mostrar hitboxes
```

Quando ativado, o jogo desenha:

- hitbox do jogador;
- área de coleta;
- hitbox dos inimigos;
- projéteis do jogador;
- projéteis inimigos;
- áreas de dano;
- raio real da explosão do inimigo explosivo.

### Velocidade dos inimigos rebalanceada

O jogador ficou mais lento nas versões anteriores, então os inimigos também foram recalibrados.

A dificuldade tardia agora cresce principalmente por:

- quantidade;
- HP;
- elites;
- padrões;
- inimigos especiais;

e menos por velocidade excessiva.

O multiplicador de velocidade por tempo possui um teto pequeno, mantendo o fim da partida difícil, mas legível.

### IA e telegraph

- Goblins usam avanços curtos em bursts.
- Morcegos fazem perseguição com movimento lateral.
- Atiradores mantêm distância.
- Magos se reposicionam menos.
- Invocadores recuam quando o jogador chega perto.
- Bombardeiros avisam antes da explosão.
- Ataques de dash possuem wind-up.
- Magos e arqueiros possuem uma curta preparação antes do disparo.

### Overlap

Foi adicionada separação leve entre corpos usando a grade espacial.

Isso reduz inimigos sobrepostos em um único ponto sem impedir a pressão da horda.

### Projéteis inimigos

Agora existem formas próprias para:

- flechas de osso;
- fragmentos sombrios;
- magia do Lich;
- fragmentos do Guardião;
- espinhos da Fera;
- runas do Arcane Titan.

A hitbox é menor que o desenho quando necessário.

### Efeitos de morte

Mortes podem usar:

- ossos desmontando;
- fragmentos de pedra;
- explosão;
- dissipação/fragmentação.

### Qualidade dos inimigos

Em Configurações:

```text
Baixa
Média
Alta
```

A qualidade reduz detalhes extras, mas não remove a silhueta principal.

## Controles

- WASD / setas: movimento
- ESC: pausa
- ataques: automáticos

## Publicação

Compatível com GitHub Pages.

Depois de substituir os arquivos, o rodapé deve mostrar:

```text
v2.2.0 • ENEMY IDENTITY • hitboxes justas
```
