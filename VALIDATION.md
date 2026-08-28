# Validação — Arcane Horder 2.9.0

## Automatizado
- 30 arquivos JavaScript: sintaxe OK.
- Imports locais: todos versionados com `?v=2.9.0`.
- 42 habilidades-base / 42 evoluções: preservadas.
- 49 Arcane Fusions até Lv.14: preservadas.
- 17 Fusion Items / 18 Run Items: preservados.
- 14 classes / 14 Signature Abilities: preservadas.
- 686 smoke cases de Fusion: OK.
- Fusion kill effects: OK.
- Gameplay systems 2.7: OK.
- Advanced progression 2.7: OK.
- Signature/Grimoire 2.8: OK.

## Teste específico 2.9
`tests/update-2.9-hud-build.mjs` confirma:
- 9 abas do menu ESC presentes.
- nomes de Run Items não são renderizados permanentemente na HUD.
- tracker de Fusion não lista nomes de Fusion Items permanentemente.
- Build Inspector usa modificadores atuais do Player para dano/cooldown/área/crit etc.
- dano total, kills e DPS recente são lidos da telemetria da run.
- Fusion Lv.8/14 identifica receita e próximo upgrade.
- item counters são expostos ao painel.
- passiva expõe cooldown restante, ativações e dano.
- game loop bloqueia `update(dt)` enquanto pausado.
- breakpoints de responsividade presentes.

## Bug corrigido durante os testes
O teste legado `fusion-kill-effects.mjs` usa um mock parcial do Game. A nova telemetria `sourceKills` assumia inicialmente que a tabela já existia. O código agora inicializa as estruturas de telemetria defensivamente, mantendo compatibilidade com mocks e estados migrados.

## Navegador
Foi tentado iniciar Chromium headless diretamente no projeto local, mas o processo não concluiu neste ambiente e foi encerrado por timeout. Portanto, não é correto declarar uma partida manual completa no navegador aqui. A validação confirmada é de sintaxe, módulos, simulação de sistemas e lógica de runtime. A inspeção visual final deve ser feita ao abrir/publicar o projeto em um navegador normal.
