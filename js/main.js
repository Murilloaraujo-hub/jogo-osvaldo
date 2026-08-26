import { Save } from './save.js';
import { Input } from './input.js';
import { UI } from './ui/menus.js';
import { AudioManager } from './audio.js';

Save.load();

const audio = new AudioManager(Save.data.settings);
const input = new Input();
const ui = new UI(Save);

window.ArcaneHorde = {
  game: null,
  ui,
  Save,
  audio,
  ready: false,
  loadError: null,
};

document.addEventListener(
  'pointerdown',
  () => {
    try {
      audio.ensure();
    } catch (error) {
      console.warn('Áudio indisponível neste navegador.', error);
    }
  },
  { once: true }
);

(async () => {
  try {
    const { Game } = await import('./game.js');
    const canvas = document.getElementById('gameCanvas');

    if (!canvas) {
      throw new Error('Canvas #gameCanvas não encontrado.');
    }

    const game = new Game(canvas, input, ui, Save);
    ui.setGame(game);

    window.ArcaneHorde.game = game;
    window.ArcaneHorde.ready = true;

    console.log(
      '%cArcane Horde v1.0.2 carregado',
      'color:#72e1bd;font-weight:bold'
    );
  } catch (error) {
    window.ArcaneHorde.loadError = error;
    console.error('Falha ao carregar o motor do Arcane Horde:', error);
    ui.flashMessage(
      'O menu carregou, mas o motor do jogo encontrou um erro. Veja o console.'
    );
  }
})();
