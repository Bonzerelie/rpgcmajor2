const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startButtons = document.querySelectorAll('[data-mode]');
const modeTitle = document.getElementById('mode-title');
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

let currentNote = '';
let audio = new Audio();
let correct = 0;
let incorrect = 0;
let isAnswered = false;
let currentNoteList = [];

const fullNoteMap = {
  'C': ['c3', 'c4', 'c5', 'c6'],
  'D': ['d3', 'd4', 'd5'],
  'E': ['e3', 'e4', 'e5'],
  'F': ['f3', 'f4', 'f5'],
  'G': ['g3', 'g4', 'g5'],
  'A': ['a3', 'a4', 'a5'],
  'B': ['b3', 'b4', 'b5']
};

const oneOctaveMap = {
  'C': ['c4'],
  'D': ['d4'],
  'E': ['e4'],
  'F': ['f4'],
  'G': ['g4'],
  'A': ['a4'],
  'B': ['b4']
};

function getNoteName(filename) {
  const activeMap = currentNoteList === allOneOctaveNotes ? oneOctaveMap : fullNoteMap;
  for (const [name, files] of Object.entries(activeMap)) {
    if (files.includes(filename)) return name;
  }
  return '';
}

const allThreeOctaveNotes = Object.values(fullNoteMap).flat();
const allOneOctaveNotes = Object.values(oneOctaveMap).flat();

function playNote(noteFile) {
  audio.src = `audio/${noteFile}.mp3`;
  audio.play();
}

function startGame(mode) {
  currentNoteList = mode === 'one-octave' ? allOneOctaveNotes : allThreeOctaveNotes;
  modeTitle.textContent = mode === 'one-octave' ? 'One Octave Mode (C4–B4)' : 'Three Octave Mode (C3–C6)';
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  loadNewNote();
}

function loadNewNote() {
  isAnswered = false;
  noteButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });
  currentNote = currentNoteList[Math.floor(Math.random() * currentNoteList.length)];
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
    promptText.textContent = `Incorrect! ❌ The note played was actually ${correctName}`;
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

startButtons.forEach(btn => {
  btn.addEventListener('click', () => startGame(btn.dataset.mode));
});

playRefBtn.addEventListener('click', () => playNote('c4'));
replayNoteBtn.addEventListener('click', () => playNote(currentNote));
nextBtn.addEventListener('click', loadNewNote);
resetScoreBtn.addEventListener('click', resetScore);
noteButtons.forEach(btn => btn.addEventListener('click', handleAnswer));
