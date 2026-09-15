import './styles.css';
import { initHeroScene } from './scene/heroScene.js';

initHeroScene();

const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 4);
});
