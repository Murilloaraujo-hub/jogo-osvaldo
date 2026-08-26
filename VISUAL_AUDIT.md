# Auditoria Visual — Arcane Horder 2.3.0

## Classes
Cada classe agora possui efeito automático com linguagem visual diferente: laser rúnico, chuva física de flechas, barreira geométrica, raízes orgânicas, projeção sombria e invocação espectral.

## Mundo
O cenário usa camadas: chão → textura → detalhes → obstáculos → eventos → entidades → efeitos. A geração é determinística por bioma, com áreas livres ao redor do spawn e culling de objetos fora da câmera.

## Obstáculos
Árvores colidem principalmente pelo tronco; rochas pela base; pilares/ruínas pelo corpo; lagos congelados pela área visual interna. O modo de debug exibe essas hitboxes.

## Minimapa
O minimapa consome as mesmas arrays do jogo para baús, eventos e inimigos especiais. Não mantém uma lista paralela de marcadores, evitando ícones antigos após coleta/despawn.
