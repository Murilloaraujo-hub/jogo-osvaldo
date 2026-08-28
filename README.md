# Arcane Horder 2.6.0 — Arsenal & Classes Update

Grande atualização integrada sobre a versão 2.5.1.

## Novas classes
- **Warlock** — 📕 — habilidade inicial **Maldição Sombria** — passiva **Pacto Sombrio**.
- **Paladino** — ☀️ — habilidade inicial **Lâmina Sagrada** — passiva **Julgamento Divino**.
- **Elementalista** — 🔷 — habilidade inicial **Projétil Elemental** — passiva **Ciclo Elemental**.
- **Mago de Batalha** — ⚔️ — habilidade inicial **Corte Arcano** — passiva **Corte Arcano**.
- **Invocador** — 🪬 — habilidade inicial **Familiar** — passiva **Familiar Ancestral**.
- **Mago Sanguíneo** — 🩸 — habilidade inicial **Nova Sanguínea** — passiva **Nova Sanguínea**.
- **Monge Arcano** — 🥋 — habilidade inicial **Explosão de Ki** — passiva **Explosão de Ki**.
- **Tecnômante** — ⚙️ — habilidade inicial **Drone Arcano** — passiva **Drone Arcano**.

## Cobertura de evolução
- Habilidades-base: **28**
- Evoluções automáticas: **28**
- Nenhuma habilidade-base ficou sem evolução.
- **Esqueleto Guerreiro → Colosso Esquelético**.

## Arcane Fusion
- Receitas totais: **34**
- As novas classes adicionam 8 receitas novas.

## Hordas
- Limites dinâmicos maiores.
- Grupos maiores e frequência crescente.
- Surtos especiais: **BONE TIDE**, **HELLGATE** e **ARCANE BREACH**.
- Novos inimigos: **Demônio da Fenda** e **Espectro Arcano**.

## Gráficos
- Iluminação aditiva leve em projéteis mágicos e meteoros.
- Novos visuais para classes, summons e efeitos.
- Relâmpago foi redesenhado como ataque vertical com telegraph; Tempestade continua sendo corrente elétrica.

## Bug importante corrigido
- `game.js` possuía duas declarações consecutivas de `const eliteChance` no mesmo bloco de spawn. Isso podia impedir o JavaScript de carregar. Agora existe apenas uma declaração.

## Compatibilidade
- Save migrado para versão 5 sem apagar o save antigo.
- Cache-busting atualizado para `?v=2.6.0`.