# Arcane Horder 2.4.0 — Validação

## Verificações automáticas concluídas

- 23 arquivos JavaScript passaram em `node --check`.
- Nenhum import local `.js` ficou sem `?v=2.4.0`.
- Todos os 6 biomas geram caminhos, POIs, água/elementos equivalentes e obstáculos.
- Renderização real do minimapa foi exercitada com Canvas compatível (Skia Canvas).
- Brilho médio do minimapa de teste: **69,9/255**.
- Proporção de pixels praticamente pretos no minimapa de teste: **0%**.
- Marcadores testados: baú, evento e miniboss.
- Spawn simulado por 30 s sem combate: **96 inimigos**, atingindo o limite dinâmico inicial sem spawn dentro de obstáculo e sem spawn colado ao jogador.
- Evento especial de horda ativado corretamente.
- Simulação de atualização com ~250 inimigos executou sem erro.
- Renderização de um frame com 220 inimigos foi concluída sem exceção.
- HP das seis classes verificado.
- Regeneração verificada: +3 exatamente aos 2 s e respeitando HP máximo.
- Evolução automática preservada: Fireball Nv.5 remove Fireball e coloca Sol Carmesim no slot.
- Renderizador das seis classes executado sem alterar `hitboxRadius`.

## Resultado por bioma

| Bioma | Caminhos | POIs | Água/área equivalente | Obstáculos |
|---|---:|---:|---:|---:|
| Ruínas Arcanas | 9 | 6 | 2 | 65 |
| Floresta Amaldiçoada | 9 | 6 | 4 | 64 |
| Deserto Escarlate | 9 | 6 | 2 | 65 |
| Terras Congeladas | 9 | 6 | 3 | 64 |
| Cidade Destruída | 9 | 6 | 2 | 68 |
| Vazio Arcano | 9 | 6 | 3 | 66 |

## Teste visual recomendado no navegador

Depois de subir ao GitHub Pages, validar em 1366×768 e 1920×1080:

1. iniciar partida;
2. confirmar terreno visível no minimapa;
3. afastar-se de um boss/evento e observar seta na borda;
4. verificar seta direcional no mundo;
5. jogar até uma `HORDA SE APROXIMANDO`;
6. conferir que inimigos não aparecem dentro de pedras/árvores/lago bloqueado;
7. testar as seis classes e observar seus acessórios;
8. ativar `Mostrar hitboxes` e confirmar que acessórios não alteram a colisão.

O ambiente de validação automatizada disponível não permite navegar o site por Chromium devido a bloqueio administrativo de URLs locais; por isso a lógica e a renderização Canvas foram validadas diretamente com módulos reais e Canvas compatível, e o teste final de sensação de gameplay deve ser feito no navegador após o deploy.
