# Arcane Horde

Action Roguelite / Bullet Heaven feito somente com HTML5, CSS3, JavaScript puro, Canvas API e localStorage.

## Executar

Use um servidor local simples e abra `index.html`.

Exemplos:

- VS Code + Live Server
- `python -m http.server 8000`

Depois abra `http://localhost:8000`.

Também pode ser publicado diretamente no GitHub Pages.

## Controles

- WASD / Setas: mover
- ESC: pausar

## Recursos implementados

- 4 classes, com desbloqueios permanentes
- 2 mapas
- Hordas escaláveis
- Inimigos corpo a corpo, à distância, elites e 3 chefes
- XP, level up e 3 escolhas aleatórias
- 15+ armas/habilidades
- 4 evoluções descobríveis
- 6 slots de armas e 6 passivas
- Drops de XP, moedas, cura, ímã e baú
- Progressão permanente
- localStorage resiliente
- Configurações e modo performance
- HUD, pause, vitória e derrota
- Partículas, números de dano e efeitos em Canvas
- Spatial Grid para reduzir custo de colisões

## Balanceamento

Os valores principais ficam centralizados em `js/config.js` e `js/weapons/weaponData.js`.
