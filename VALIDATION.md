# Validação — Arcane Horder 2.8.0

## Automatizado
- 29 arquivos JavaScript: sintaxe OK
- Importação do Game/WeaponSystem nos testes: OK
- Classes: 14
- Signature Abilities: 14
- Smoke runtime das Signatures: 84 casos (14 classes × Lv.1–5 + evolução)
- Habilidades-base totais: 42
- Evoluções automáticas: 42
- Arcane Fusions: 49
- Fusions Lv.1–14: 49/49
- Smoke tests de Fusion: 686 casos (49 × 14)
- Fusion Items: 17
- Run Items: 18
- Categorias de Run Item: common/rare/epic/legendary/cursed
- Signature de outra classe bloqueada na pool de Level Up: OK
- Signature própria continua atualizável: OK
- Signature não pode ser banida pela UI/lógica: OK
- Fusion exclusiva valida classe correta: OK
- Fusion exclusiva rejeita classe errada: OK
- Grimoire distingue desconhecida/parcial/descoberta: OK
- Receita só fica permanentemente descoberta após a Fusion ser criada: OK
- Requisitos da run mostram progresso Lv.X/5: OK
- Requisito de classe em Fusion exclusiva: OK
- Arqueiro Ósseo cap: 2/4/6/7
- Baú de elite: 11%
- Elite pode conceder item direto sem gerar baú: OK
- Tracker de Fusion usa os mesmos dados das receitas: OK
- Boss de Fusion rastreada recebe prioridade/destaque no minimapa: OK

## Testes executados
- fusion-kill-effects.mjs
- fusion-smoke.mjs
- fusion-system.mjs
- fusion-upgrades.mjs
- gameplay-2.7.mjs
- update-2.6-coverage.mjs
- update-2.7-advanced.mjs
- update-2.8-signatures-grimoire.mjs

## Navegador
Foi tentado executar Chromium headless diretamente sobre o projeto. O processo não concluiu adequadamente no ambiente (restrições da execução/local navigation), portanto não é correto declarar uma partida manual completa em navegador aqui. Os testes confirmados são de sintaxe, módulos e simulações do motor.
