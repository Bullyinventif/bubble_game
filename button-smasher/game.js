// ============================================================
// BUTTON SMASHER - Logique du jeu
// ============================================================

// Configuration des niveaux
const LEVELS = [
  {
    id: 1,
    name: "Niveau 1",
    description: "Clique 4 fois sur le bouton rouge",
    buttons: [
      { id: 0, color: "red", isCorrect: true }
    ],
    requiredClicks: 4,
    maxClicks: 5
  },
  {
    id: 2,
    name: "Niveau 2",
    description: "Clique toujours sur le MÊME bouton",
    buttons: [
      { id: 0, color: "red", isCorrect: true },
      { id: 1, color: "blue", isCorrect: false }
    ],
    requiredClicks: 4,
    maxClicks: 5
  },
  {
    id: 3,
    name: "Niveau 3",
    description: "Trouve le bon bouton parmi plusieurs",
    buttons: [
      { id: 0, color: "red", isCorrect: true },
      { id: 1, color: "blue", isCorrect: false },
      { id: 2, color: "green", isCorrect: false }
    ],
    requiredClicks: 4,
    maxClicks: 5
  },
  {
    id: 4,
    name: "Niveau 4",
    description: "Le défi continue...",
    buttons: [
      { id: 0, color: "red", isCorrect: true },
      { id: 1, color: "blue", isCorrect: false },
      { id: 2, color: "green", isCorrect: false },
      { id: 3, color: "yellow", isCorrect: false }
    ],
    requiredClicks: 4,
    maxClicks: 5
  },
  {
    id: 5,
    name: "Niveau 5",
    description: "Presque là !",
    buttons: [
      { id: 0, color: "red", isCorrect: true },
      { id: 1, color: "blue", isCorrect: false },
      { id: 2, color: "green", isCorrect: false },
      { id: 3, color: "yellow", isCorrect: false },
      { id: 4, color: "pink", isCorrect: false }
    ],
    requiredClicks: 4,
    maxClicks: 5
  },
  {
    id: 6,
    name: "Niveau 6",
    description: "Dernier niveau !",
    buttons: [
      { id: 0, color: "red", isCorrect: true },
      { id: 1, color: "blue", isCorrect: false },
      { id: 2, color: "green", isCorrect: false },
      { id: 3, color: "yellow", isCorrect: false },
      { id: 4, color: "pink", isCorrect: false },
      { id: 5, color: "cyan", isCorrect: false }
    ],
    requiredClicks: 4,
    maxClicks: 5
  }
];

// État du jeu
let gameState = {
  currentLevel: 0,
  clickCount: 0,
  selectedButton: null, // Pour le niveau 2, on doit cliquer sur le même bouton
  totalClicks: 0 // Compteur total pour détecter les 5 clics
};

// Éléments DOM
const titleScreen = document.getElementById('titleScreen');
const gameScreen = document.getElementById('gameScreen');
const winScreen = document.getElementById('winScreen');
const loseScreen = document.getElementById('loseScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const loseRestartBtn = document.getElementById('loseRestartBtn');
const menuBtn = document.getElementById('menuBtn');
const loseMenuBtn = document.getElementById('loseMenuBtn');
const levelIndicator = document.getElementById('levelIndicator');
const levelNum = document.getElementById('levelNum');
const clickCounter = document.getElementById('clickCounter');
const clickCount = document.getElementById('clickCount');
const buttonsGrid = document.getElementById('buttonsGrid');

// ============================================================
// FONCTIONS PRINCIPALES
// ============================================================

// Initialiser le jeu
function initGame() {
  gameState = {
    currentLevel: 0,
    clickCount: 0,
    selectedButton: null,
    totalClicks: 0
  };
  
  showScreen('game');
  renderLevel();
}

// Afficher un écran
function showScreen(screen) {
  // Cacher tous les écrans
  titleScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  winScreen.classList.remove('active');
  loseScreen.classList.remove('active');
  
  // Afficher l'écran demandé
  if (screen === 'title') {
    titleScreen.classList.add('active');
  } else if (screen === 'game') {
    gameScreen.classList.add('active');
  } else if (screen === 'win') {
    winScreen.classList.add('active');
  } else if (screen === 'lose') {
    loseScreen.classList.add('active');
  }
}

// Charger un niveau
function renderLevel() {
  const level = LEVELS[gameState.currentLevel];
  
  // Mettre à jour l'affichage
  levelNum.textContent = level.id;
  clickCount.textContent = gameState.clickCount;
  
  // Vider la grille de boutons
  buttonsGrid.innerHTML = '';
  buttonsGrid.className = `buttons-grid level-${level.id}`;
  
  // Créer les boutons
  level.buttons.forEach(button => {
    const buttonEl = createGameButton(button);
    buttonsGrid.appendChild(buttonEl);
  });
}

// Créer un bouton de jeu
function createGameButton(button) {
  const buttonEl = document.createElement('div');
  buttonEl.className = `game-button ${button.color}`;
  buttonEl.dataset.id = button.id;
  buttonEl.dataset.correct = button.isCorrect;
  buttonEl.dataset.color = button.color;
  
  // Sprite normal
  const normalSprite = document.createElement('div');
  normalSprite.className = 'btn-sprite normal';
  normalSprite.textContent = getButtonLabel(button.color);
  
  // Sprite pressé
  const pressedSprite = document.createElement('div');
  pressedSprite.className = 'btn-sprite pressed';
  pressedSprite.textContent = getButtonLabel(button.color);
  pressedSprite.style.display = 'none';
  
  buttonEl.appendChild(normalSprite);
  buttonEl.appendChild(pressedSprite);
  
  // Gestion du clic
  buttonEl.addEventListener('mousedown', () => {
    normalSprite.style.display = 'none';
    pressedSprite.style.display = 'block';
  });
  
  buttonEl.addEventListener('mouseup', () => {
    normalSprite.style.display = 'block';
    pressedSprite.style.display = 'none';
  });
  
  buttonEl.addEventListener('mouseleave', () => {
    normalSprite.style.display = 'block';
    pressedSprite.style.display = 'none';
  });
  
  // Gestion du clic (le vrai)
  buttonEl.addEventListener('click', () => handleButtonClick(button));
  
  return buttonEl;
}

// Gérer un clic sur un bouton
function handleButtonClick(button) {
  const level = LEVELS[gameState.currentLevel];
  
  // Vérifier si c'est le bon bouton
  // Pour le niveau 1, seul le bouton rouge est correct
  // Pour les niveaux 2+, on doit cliquer sur le même bouton que la première fois
  let isCorrect = button.isCorrect;
  
  // Pour le niveau 2+, si on a déjà sélectionné un bouton, on vérifie que c'est le même
  if (gameState.currentLevel >= 1) { // Niveau 2 et +
    if (gameState.selectedButton === null) {
      // Premier clic sur ce niveau : on enregistre le bouton
      gameState.selectedButton = button.id;
      isCorrect = button.isCorrect;
    } else {
      // On vérifie que c'est le même bouton que le premier clic
      isCorrect = (button.id === gameState.selectedButton) && button.isCorrect;
    }
  }
  
  // Incrémenter les compteurs
  gameState.totalClicks++;
  
  if (isCorrect) {
    gameState.clickCount++;
    
    // Animation de feedback
    document.querySelector(`[data-id="${button.id}"]`).classList.add('pulse');
    setTimeout(() => {
      document.querySelector(`[data-id="${button.id}"]`).classList.remove('pulse');
    }, 300);
    
    // Vérifier si on a gagné le niveau
    if (gameState.clickCount >= level.requiredClicks) {
      // Passer au niveau suivant
      gameState.currentLevel++;
      gameState.clickCount = 0;
      gameState.selectedButton = null;
      
      // Vérifier si on a terminé tous les niveaux
      if (gameState.currentLevel >= LEVELS.length) {
        showScreen('win');
      } else {
        renderLevel();
      }
    }
  } else {
    // Mauvais bouton : animation de shake
    document.querySelector(`[data-id="${button.id}"]`).classList.add('shake');
    setTimeout(() => {
      document.querySelector(`[data-id="${button.id}"]`).classList.remove('shake');
    }, 500);
    
    // Incrémenter quand même le compteur d'affichage
    gameState.clickCount++;
  }
  
  // Vérifier si on a dépassé le nombre maximal de clics
  if (gameState.totalClicks >= 5) {
    showScreen('lose');
  }
  
  // Mettre à jour l'affichage
  clickCount.textContent = gameState.clickCount;
}

// Obtenir le label d'un bouton
function getButtonLabel(color) {
  const labels = {
    red: '🔴',
    blue: '🔵',
    green: '🟢',
    yellow: '🟡',
    pink: '💖',
    cyan: '🔶',
    purple: '🟣',
    orange: '🟠'
  };
  return labels[color] || '?';
}

// ============================================================
// EVENEMENTS
// ============================================================

// Démarrer le jeu
startBtn.addEventListener('click', () => {
  initGame();
});

// Recommencer
restartBtn.addEventListener('click', () => {
  initGame();
});

// Recommencer après défaite
loseRestartBtn.addEventListener('click', () => {
  initGame();
});

// Retour au menu
menuBtn.addEventListener('click', () => {
  showScreen('title');
});

// Retour au menu après défaite
loseMenuBtn.addEventListener('click', () => {
  showScreen('title');
});

// Initialiser au chargement
showScreen('title');
