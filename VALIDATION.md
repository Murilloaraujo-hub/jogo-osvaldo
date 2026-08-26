# Arcane Horder 2.3.0 — Validação

## Verificações automatizadas executadas
- Todos os arquivos JavaScript passaram em `node --check`.
- `game.js` foi importado como ES module sem erro.
- Smoke test das 6 classes passou.
- Regeneração universal validada: +3 HP / 2 s e clamp no HP máximo.
- Exército dos Caídos validado com registro exclusivo de `sourceId === "skeleton"`.
- Ressuscitados aparecem, duram 20 s e não alimentam o registro do Necromante.
- Evolução automática Fireball Nv.5 → Sol Carmesim validada com remoção do ID antigo.
- Geração do mundo e obstáculos validada.
- Renderização básica do mundo, minimapa e passivas executada em ambiente de smoke test.
- Migração de save 2 → 3 validada preservando moedas e adicionando configurações novas.
- Não existem imports locais `.js` sem cache-busting `?v=2.3.0`.

## Checklist manual recomendado no navegador
1. Iniciar uma partida com cada classe e observar a passiva na HUD.
2. Mago: aguardar 5 s e confirmar carga + Laser Rúnico.
3. Arqueiro: aguardar 7 s e confirmar área marcada + flechas visíveis.
4. Cavaleiro: aguardar 8 s e confirmar barreira por 2 s + explosão.
5. Druida: aguardar 8 s e confirmar raízes e controle.
6. Assassino: aguardar 6 s e confirmar projeção sem mover o jogador.
7. Necromante: deixar esqueletos matarem inimigos e aguardar 30 s; confirmar aliados espectrais e desaparecimento após 20 s.
8. Tomar dano e confirmar +3 HP a cada 2 s.
9. Levar uma habilidade com evolução até Nv.5 e confirmar substituição automática.
10. Conferir o minimapa no canto superior direito e os marcadores de baús/eventos/elites/bosses.
11. Entrar em diferentes biomas e confirmar identidade visual distinta.
12. Ativar `Mostrar hitboxes` e testar troncos, pedras, pilares e lagos congelados.
13. Reiniciar a partida e confirmar que timers/passivas/regen não carregam estado anterior.
14. Atualizar a página e confirmar preservação do save.

## Console
Não foram encontrados `SyntaxError` ou erros de importação nos testes automatizados. Para validação final do navegador, abrir DevTools e confirmar ausência de `Uncaught TypeError`, `ReferenceError`, `NaN position` ou falhas de módulo.
