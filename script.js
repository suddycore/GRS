// ======================
// Инициализация данных
// ======================
const prizes = [
    { name: "🍹 Mimosa", emoji: "🍹", value: "mimosa" },
    { name: "🍺 Пиво", emoji: "🍺", value: "beer" },
    { name: "🥃 Виски", emoji: "🥃", value: "whiskey" },
    { name: "💰 Джекпот!", emoji: "💰", value: "jackpot" },
    { name: "🍬 Конфеты", emoji: "🍬", value: "candy" },
    { name: "🔊 Музыка", emoji: "🔊", value: "music" },
    { name: "🎲 Кости", emoji: "🎲", value: "dice" },
    { name: "🚬 Сигарета", emoji: "🚬", value: "cigarette" }
];

// DOM элементы
const authSection = document.getElementById('authSection');
const gameSection = document.getElementById('gameSection');
const loginBtn = document.getElementById('loginBtn');
const playerNameInput = document.getElementById('playerName');
const errorMessage = document.getElementById('errorMessage');
const spinBtn = document.getElementById('spinBtn');
const prizeDisplay = document.querySelector('.prize-display');
const drum1 = document.getElementById('drum1');
const drum2 = document.getElementById('drum2');
const drum3 = document.getElementById('drum3');
const attemptsLeftDisplay = document.getElementById('attemptsLeft');
const cooldownTimeDisplay = document.getElementById('cooldownTime');
const liveTapeContent = document.getElementById('liveTapeContent');
const pauseTapeBtn = document.getElementById('pauseTapeBtn');
const resetTapeBtn = document.getElementById('resetTapeBtn');
const loadingScreen = document.getElementById('loadingScreen');

// Игровые переменные
let playerName = '';
let attemptsLeft = 1;
let cooldownEndTime = 0;
let liveEntries = [];
let tapeAnimationPaused = false;

// ======================
// Загрузка данных из localStorage
// ======================
function loadGameData() {
    playerName = localStorage.getItem('grsPlayerName') || '';
    attemptsLeft = parseInt(localStorage.getItem('grsAttemptsLeft')) || 1;
    cooldownEndTime = parseInt(localStorage.getItem('grsCooldownEnd')) || 0;

    if (
