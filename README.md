# Arcane Horder 2.9.0 — Clean HUD & Build Analyzer

Atualização integrada sobre a 2.8.0. Preserva Signature Abilities, Arcane Grimoire, 49 Fusions até Lv.14, Fusion Items, boss a cada 2 minutos, minimapa, biomas, eventos, hordas, regeneração, relíquias e progressão anterior.

## HUD limpa
- Habilidades: ícone + Lv./EVOL./Fusion.
- Itens, Relíquias e Fusion Items: ícones compactos; nomes e descrições ficam em tooltip/ESC.
- Tracker de Fusion foi compactado: mostra ícone + progresso, sem listar permanentemente nomes de itens na tela.
- Passiva de classe na HUD mostra ícone + recarga; detalhes completos ficam no menu de pausa.

## Menu ESC — Build Analyzer
O ESC pausa de verdade o update do jogo e abre as abas:
RESUMO, HABILIDADES, FUSIONS, ITENS, RELÍQUIAS, PASSIVA, ESTATÍSTICAS, GRIMÓRIO e CONFIGURAÇÕES.

O painel detalhado usa dados da run atual. `js/systems/buildInspector.js` lê o mesmo `Player`, `WEAPONS`, `getWeaponStats`, Fusions, itens, relíquias e telemetria usados pelo gameplay.

### Habilidades / Fusions
Mostra somente métricas relevantes à mecânica, como dano atual, cooldown atual, área, velocidade, projéteis/ataques, perfuração, saltos, alcance, duração, summons ativos, status, dano total na run, DPS recente, contribuição no dano e kills. Fusions também exibem receita e próximo upgrade até Lv.14.

### Itens / Relíquias
Mostra raridade, descrição real, Fusion Item source/receitas e contadores de uso quando a mecânica possui ativações observáveis (Echo Crystal, Mirror Rune, Storm Battery, Death Bell etc.).

### Passiva
Mostra cooldown, tempo restante congelado durante a pausa, ativações, dano acumulado, DPS recente e métricas específicas de cada classe.

### Estatísticas
Resumo da run + damage breakdown agrupado pela habilidade principal, para evitar nomes técnicos de efeitos secundários.

## Pausa verdadeira
O game loop mantém renderização da tela, mas não chama `update(dt)` enquanto `paused === true`. Como o timestamp do loop continua sendo atualizado, ficar 30 segundos no ESC não injeta 30 segundos de deltaTime ao voltar. Cooldowns, spawn, regen, inimigos, projéteis, bosses, passivas e timers permanecem no mesmo instante.

## Responsividade
O Build Analyzer usa layout em duas colunas no desktop e reorganiza lista/detalhes em telas menores, com breakpoints dedicados para tablets e celulares. Nomes longos quebram dentro dos cards em vez de ultrapassar o painel.

## Compatibilidade
Nenhuma configuração nova obrigatória foi adicionada ao save. Todos os imports locais usam cache-busting `?v=2.9.0`.
