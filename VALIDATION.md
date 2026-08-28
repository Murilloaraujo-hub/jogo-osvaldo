# Validação 2.7.0 — Advanced Progression

## Automatizado
- Sintaxe de todos os módulos JavaScript: OK
- Importação de `Game`: OK
- Evoluções automáticas: 28
- Arcane Fusions: 35
- Fusions com `max = 14`: 35/35
- Smoke tests de runtime de Fusion: 490 casos (35 receitas × 14 níveis)
- Fusion Items: 10
- Recipe com item bloqueia corretamente sem o item
- Item é consumido apenas quando a Fusion é criada
- Familiar Luminoso usa movimento orbital
- Familiar Lv.1–5 configura 1–5 projéteis
- Celestial Wisp mantém forma orbital e padrão avançado
- Familiar Solar adicionado
- Arqueiro Ósseo: cap próprio 3/5/7/8 por faixa temporal
- Máximo de 1 Arqueiro Ósseo novo por grupo de spawn
- Boss scheduler: ticket a cada 120s
- Boss queue: boss novo aguarda se já existe boss vivo
- Boss deck: não repete até consumir o pool
- Novos bosses: 8
- Fusion Items com fontes válidas: 10/10
- Minimap inclui Fusion Items e bosses programados

## Teste de navegador
Foi tentado iniciar o projeto em Chromium headless por servidor HTTP local.
O ambiente bloqueou a navegação local com `net::ERR_BLOCKED_BY_ADMINISTRATOR`.
Por isso não é correto afirmar que foi feita uma partida manual completa em navegador neste ambiente.

Os testes executados foram de sintaxe, imports ES Modules e simulações do motor.
