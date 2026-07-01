// ============================================================
// 🎨 RENDU PARTAGÉ — cartes, hero, fond animé, chrome de page
// Script classique (pas de module) : fonctionne en double-clic
// (file://) comme sur GitHub Pages. Dépend de games-data.js
// chargé AVANT ce fichier (variable globale GAMES).
// ============================================================

const MAX_ID = Math.max(...GAMES.map(g => g.id));

// Un jeu est "nouveau" s'il fait partie des 2 ids les plus récents
function isNew(g) { return g.id >= MAX_ID - 1; }
function isPopular(g) { return (g.categories || []).includes('popular'); }

// Liste triée du plus récent au plus ancien
function gamesByRecent() { return [...GAMES].sort((a, b) => b.id - a.id); }

function badges(g) {
  return `
    ${isNew(g) ? '<span class="bdg new">NEW</span>' : ''}
    ${isPopular(g) ? '<span class="bdg pop">POP</span>' : ''}`;
}

// Carte "app store" plein cadre (design Piste B)
function gameCard(g) {
  return `
    <a class="card" href="${g.url}" target="_blank" rel="noopener" data-id="${g.id}">
      <img src="${g.image}" alt="${g.name}" onerror="this.style.opacity=.15">
      <div class="scrim"></div>
      <div class="cbadges">${badges(g)}</div>
      <div class="cinfo">
        <div class="cname">${g.name}</div>
        <div class="cdesc">${g.desc}</div>
        <span class="cplay">▶ JOUER</span>
      </div>
    </a>`;
}

// Bannière "Jeu à la une"
function heroMarkup(g) {
  return `
    <img src="${g.image}" alt="${g.name}" onerror="this.style.display='none'">
    <div class="hero-scrim"></div>
    <div class="hero-in">
      <div class="hero-kick">★ Jeu à la une</div>
      <div class="hero-title">${g.name}</div>
      <div class="hero-desc">${g.desc}</div>
      <a class="hero-btn" href="${g.url}" target="_blank" rel="noopener">▶ Jouer maintenant</a>
    </div>`;
}

// Bulles néon flottantes en arrière-plan
function mountBubbles(el, count = 16) {
  if (!el) return;
  const cols = ['#00E5FF', '#8B5CFF', '#00FF88', '#FFE000', '#FF2E88'];
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const s = 12 + Math.random() * 60;
    const c = cols[Math.floor(Math.random() * cols.length)];
    b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;` +
      `animation-delay:${Math.random() * 12}s;animation-duration:${9 + Math.random() * 11}s;` +
      `background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.12),${c}22,transparent);` +
      `border:1px solid ${c}40`;
    el.appendChild(b);
  }
}

// Menu mobile + année du footer (chrome commun à toutes les pages)
function initChrome() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('menuClose');
  if (toggle && menu) {
    const open = () => { menu.classList.add('open'); toggle.style.transform = 'scale(1.12) rotate(18deg)'; };
    const shut = () => { menu.classList.remove('open'); toggle.style.transform = ''; };
    toggle.addEventListener('click', () => menu.classList.contains('open') ? shut() : open());
    if (close) close.addEventListener('click', shut);
    window.addEventListener('resize', () => { if (window.innerWidth > 640) shut(); });
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
