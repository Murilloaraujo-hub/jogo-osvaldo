import{Save}from'./save.js';import{Input}from'./input.js';import{UI}from'./ui/menus.js';import{Game}from'./game.js';import{AudioManager}from'./audio.js';
Save.load();const audio=new AudioManager(Save.data.settings);const input=new Input();const ui=new UI(Save);const game=new Game(document.getElementById('gameCanvas'),input,ui,Save);ui.setGame(game);window.ArcaneHorde={game,ui,Save,audio};document.addEventListener('pointerdown',()=>audio.ensure(),{once:true});
console.log('%cArcane Horde v1.0.0','color:#72e1bd;font-weight:bold');
