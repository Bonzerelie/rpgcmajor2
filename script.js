const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startModeButtons = document.querySelectorAll('#mode-select .green-button');
const switchModeButtons = document.querySelectorAll('#mode-switcher .green-button');
const modeLabel = document.getElementById('mode-label');

const playRefBtn = document.getElementById('play-reference');
const replayNoteBtn = document.getElementById('replay-note');
const nextBtn = document.getElementById('next-button');
const resetScoreBtn = document.getElementById('reset-score');
const promptText = document.getElementById('prompt');
const noteButtons = document.querySelectorAll('.blue-button');

const correctCount = document.getElementById('correct-count');
const incorrectCount = document.getElementById('incorrect-count');
const totalCount = document.getElementById('total-count');
const accuracyDisplay = document.getElementById('accuracy');

const noteMap = {
  'C': ['c3', 'c4', 'c5', 'c6'],
  'D': ['d3', 'd4', 'd5'],
  'E': ['e3', 'e4', 'e5'],
  'F': ['f3', 'f4', 'f5'],
  'G': ['g3', 'g4', 'g5'],
  'A': ['a3', 'a4', 'a5'],
  'B': ['b3', 'b4', 'b5']
};

const oneOctaveFiles = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4'];
const threeOctaveFiles = Object.values(noteMap).flat();

let currentMode = 'three'; // default
let currentNote = '';
let audio = new Audio();
let correct = 0;
let incorrect = 0;
let isAnswered = false;

function getCurrentNotePool() {
  return currentMode === 'one' ? oneOctaveFiles : threeOctaveFiles;
}

function getNoteName(filename) {
  for (const [name, files] of Object.entries(noteMap)) {
    if (files.includes(filename)) return name;
  }
  return '';
}

function playNote(noteFile) {
  audio.src = `audio/${noteFile}.mp3`;
  audio.play();
}

function startGame(mode) {
  currentMode = mode;
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  updateModeLabel();
  loadNewNote();
}

function updateModeLabel() {
  modeLabel.textContent = `Mode: ${currentMode === 'one' ? 'One Octave (C4–B4)' : 'Three Octaves (C3–C6)'}`;
}

function loadNewNote() {
  isAnswered = false;
  noteButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });
  const pool = getCurrentNotePool();
  currentNote = pool[Math.floor(Math.random() * pool.length)];
  playNote(currentNote);
  promptText.textContent = 'Which note was played?';
  nextBtn.disabled = true;
}

function handleAnswer(e) {
  if (isAnswered) return;
  isAnswered = true;

  const selected = e.target.getAttribute('data-note');
  const correctName = getNoteName(currentNote);

  if (selected === correctName) {
    correct++;
    e.target.classList.add('correct');
    promptText.textContent = `Correct! ✅ The note was ${correctName}`;
  } else {
    incorrect++;
    e.target.classList.add('incorrect');
    const correctBtn = [...noteButtons].find(btn => btn.getAttribute('data-note') === correctName);
    if (correctBtn) correctBtn.classList.add('correct');
    promptText.textContent = `Incorrect! ❌ The note was actually ${correctName}`;
  }

  updateScore();
  nextBtn.disabled = false;
  noteButtons.forEach(btn => btn.disabled = true);
}

function updateScore() {
  const total = correct + incorrect;
  correctCount.textContent = correct;
  incorrectCount.textContent = incorrect;
  totalCount.textContent = total;
  accuracyDisplay.textContent = total ? ((correct / total) * 100).toFixed(1) + '%' : '0.0%';
}

function resetScore() {
  correct = 0;
  incorrect = 0;
  updateScore();
}

startModeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.getAttribute('data-mode');
    startGame(mode);
  });
});

switchModeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.getAttribute('data-mode');
    currentMode = mode;
    updateModeLabel();
    loadNewNote();
  });
});

playRefBtn.addEventListener('click', () => playNote('c4'));
replayNoteBtn.addEventListener('click', () => playNote(currentNote));
nextBtn.addEventListener('click', loadNewNote);
resetScoreBtn.addEventListener('click', resetScore);
noteButtons.forEach(btn => btn.addEventListener('click', handleAnswer));
