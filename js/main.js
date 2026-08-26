import { Save } from './save.js';
import { Input } from './input.js';
import { UI } from './ui/menus.js';
import { AudioManager } from './audio.js';

Save.load();

const audio = new AudioManager(Save.data.settings);
const input = new Input();
const ui = new UI(Save);

window.ArcaneHorder = {
  game: null,
  ui,
  Save,
  audio,
  ready: false,
  loadError: null
};

document.addEventListener('pointerdown', () => {
  try { audio.ensure(); }
  catch (error) { console.warn('Áudio indisponível neste navegador.', error); }
}, { once: true });

(async () => {
  try {
    const { Game } = await import('./game.js');
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) throw new Error('Canvas #gameCanvas não encontrado.');
    const game = new Game(canvas, input, ui, Save);
    ui.setGame(game);
    window.ArcaneHorder.game = game;
    window.ArcaneHorder.ready = true;
    console.log('%cArcane Horder 2.1 carregado', 'color:#72e1bd;font-weight:bold');
  } catch (error) {
    window.ArcaneHorder.loadError = error;
    console.error('Falha ao carregar o motor do Arcane Horder:', error);
    ui.flashMessage(`Erro ao carregar o motor: ${error.message}`);
  }
})();
