// ---------------------------------------------------------
// Memory Game — logique principale
// Jeu de paires d'emojis avec compteur de coups, chronomètre
// et meilleur score persisté dans le localStorage.
// ---------------------------------------------------------

const BEST_SCORE_KEY = "memory-game-best-moves";

/** Liste des emojis utilisés (une paire sera créée pour chacun). */
const EMOJIS = ["🍕", "🚀", "🐱", "🎸", "🌵", "⚽", "🍉", "🎲"];

const board = document.getElementById("board");
const movesLabel = document.getElementById("moves");
const timerLabel = document.getElementById("timer");
const bestScoreLabel = document.getElementById("best-score");
const restartBtn = document.getElementById("restart-btn");
const winOverlay = document.getElementById("win-overlay");
const finalMovesLabel = document.getElementById("final-moves");
const finalTimeLabel = document.getElementById("final-time");
const newBestBadge = document.getElementById("new-best-badge");
const playAgainBtn = document.getElementById("play-again-btn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;

/**
 * Mélange un tableau selon l'algorithme de Fisher-Yates.
 * @param {Array} array
 * @returns {Array} le même tableau, mélangé
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Construit la liste des cartes (chaque emoji en double), mélangée.
 * @returns {Array<{id: number, emoji: string}>}
 */
function createDeck() {
  const deck = [...EMOJIS, ...EMOJIS].map((emoji, index) => ({
    id: index,
    emoji,
  }));
  return shuffle(deck);
}

/**
 * Lit le meilleur score (nombre de coups) sauvegardé.
 * @returns {number|null}
 */
function getBestScore() {
  const raw = localStorage.getItem(BEST_SCORE_KEY);
  return raw ? Number(raw) : null;
}

/**
 * Met à jour l'affichage du meilleur score.
 */
function renderBestScore() {
  const best = getBestScore();
  bestScoreLabel.textContent = `Meilleur score : ${
    best !== null ? `${best} coups` : "—"
  }`;
}

/**
 * Démarre le chronomètre (une seule fois par partie).
 */
function startTimer() {
  if (gameStarted) return;
  gameStarted = true;
  timerInterval = setInterval(() => {
    seconds++;
    timerLabel.textContent = `Temps : ${seconds}s`;
  }, 1000);
}

/**
 * Arrête le chronomètre.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

/**
 * Met à jour le compteur de coups affiché.
 */
function renderMoves() {
  movesLabel.textContent = `Coups : ${moves}`;
}

/**
 * Crée l'élément DOM correspondant à une carte.
 * @param {{id: number, emoji: string}} cardData
 * @returns {HTMLElement}
 */
function buildCardElement(cardData) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = cardData.id;
  card.dataset.emoji = cardData.emoji;

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const front = document.createElement("div");
  front.className = "card-front";
  front.textContent = "❓";

  const back = document.createElement("div");
  back.className = "card-back";
  back.textContent = cardData.emoji;

  inner.append(front, back);
  card.appendChild(inner);

  card.addEventListener("click", () => onCardClick(card));

  return card;
}

/**
 * Construit et affiche le plateau de jeu.
 */
function renderBoard() {
  board.innerHTML = "";
  const deck = createDeck();
  deck.forEach((cardData) => {
    board.appendChild(buildCardElement(cardData));
  });
}

/**
 * Gère le clic sur une carte.
 * @param {HTMLElement} card
 */
function onCardClick(card) {
  if (
    lockBoard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  startTimer();
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves++;
  renderMoves();

  checkForMatch();
}

/**
 * Compare les deux cartes retournées et déclenche la suite logique.
 */
function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

/**
 * Traite le cas où les deux cartes retournées correspondent.
 */
function handleMatch() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  matchedPairs++;
  resetSelection();

  if (matchedPairs === EMOJIS.length) {
    endGame();
  }
}

/**
 * Traite le cas où les deux cartes retournées ne correspondent pas :
 * elles sont retournées à nouveau après un court délai.
 */
function handleMismatch() {
  const cardsToReset = [firstCard, secondCard];
  setTimeout(() => {
    cardsToReset.forEach((card) => card.classList.remove("flipped"));
    resetSelection();
  }, 800);
}

/**
 * Réinitialise la sélection courante (première/deuxième carte).
 */
function resetSelection() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

/**
 * Termine la partie : arrête le chrono, met à jour le meilleur score
 * et affiche l'écran de victoire.
 */
function endGame() {
  stopTimer();

  const best = getBestScore();
  const isNewBest = best === null || moves < best;

  if (isNewBest) {
    localStorage.setItem(BEST_SCORE_KEY, String(moves));
  }

  finalMovesLabel.textContent = String(moves);
  finalTimeLabel.textContent = `${seconds}s`;
  newBestBadge.classList.toggle("hidden", !isNewBest);
  winOverlay.classList.remove("hidden");

  renderBestScore();
}

/**
 * Réinitialise entièrement l'état du jeu et redémarre une nouvelle partie.
 */
function startNewGame() {
  stopTimer();
  moves = 0;
  seconds = 0;
  matchedPairs = 0;
  gameStarted = false;
  resetSelection();

  renderMoves();
  timerLabel.textContent = "Temps : 0s";
  winOverlay.classList.add("hidden");

  renderBoard();
  renderBestScore();
}

// --- Écouteurs d'évènements ---

restartBtn.addEventListener("click", startNewGame);
playAgainBtn.addEventListener("click", startNewGame);

// --- Initialisation ---
startNewGame();
