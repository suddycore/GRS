// ======================
// Глобальные переменные
// ======================
const prizes = [
    { name: "🍹 Mimosa", value: "mimosa", img: "images/mimosa.png" },
    { name: "🍺 Пиво", value: "beer", img: "images/beer.png" },
    { name: "🥃 Виски", value: "whiskey", img: "images/whiskey.png" },
    { name: "🎰 Джекпот!", value: "jackpot", img: "images/jackpot.png" }
];

// DOM-элементы
const authSection = document.getElementById('authSection');
const gameSection = document.getElementById('gameSection');
const playerNameInput = document.getElementById('playerName');
const loginBtn = document.getElementById('loginBtn');
const spinBtn = document.getElementById('spinBtn');
const prizeDisplay = document.getElementById('prizeDisplay');
const cooldownDisplay = document.getElementById('cooldownDisplay');
const attemptsLeftDisplay = document.getElementById('attemptsLeft');
const liveTapeContent = document.getElementById('liveTapeContent');
const errorMessage = document.getElementById('errorMessage');

// Состояние игры
let playerName = '';
let attemptsLeft = 1;
let cooldownEndTime = 0;
let liveEntries = [];

// ======================
// Инициализация
// ======================
function init() {
    // Проверяем авторизацию и сохранённое состояние
    playerName = localStorage.getItem('grsPlayerName');
    attemptsLeft = parseInt(localStorage.getItem('grsAttemptsLeft')) || 1;
    cooldownEndTime = parseInt(localStorage.getItem('grsCooldownEnd')) || 0;

    // Если игрок авторизован, показываем игру
    if (playerName) {
        authSection.style.display = 'none';
        gameSection.style.display = 'block';
        updateUI();
    }

    // Проверяем КД
    checkCooldown();

    // Запускаем обновление live-ленты и КД
    setInterval(updateUI, 1000);
}

// ======================
// Авторизация
// ======================
loginBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        errorMessage.textContent = "Введите никнейм!";
        return;
    }
    localStorage.setItem('grsPlayerName', playerName);
    authSection.style.display = 'none';
    gameSection.style.display = 'block';
    updateUI();
});

// ======================
// Логика слота
// ======================
function spinSlots() {
    if (attemptsLeft <= 0) {
        addLiveEntry(`❌ ${playerName}: Попыток нет!`);
        return;
    }

    attemptsLeft--;
    localStorage.setItem('grsAttemptsLeft', attemptsLeft);
    updateUI();

    // Сбрасываем КД
    cooldownEndTime = Date.now() + 300000; // 5 минут
    localStorage.setItem('grsCooldownEnd', cooldownEndTime);

    // Анимация вращения
    document.querySelectorAll('.slot-drum').forEach(drum => {
        drum.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            drum.style.transform = 'rotate(0deg)';
        }, 1000);
    });

    // Определяем результат
    setTimeout(() => {
        const results = [];
        for (let i = 0; i < 3; i++) {
            results.push(prizes[Math.floor(Math.random() * prizes.length)]);
        }

        // Проверяем на выигрыш
        if (results[0].value === results[1].value && results[1].value === results[2].value) {
            const prize = results[0];
            prizeDisplay.textContent = `🎉 ПОБЕДА! ${prize.name}`;

            // Обновляем барабаны
            document.getElementById('drum1').innerHTML = `<img src="${prize.img}" width="80">`;
            document.getElementById('drum2').innerHTML = `<img src="${prize.img}" width="80">`;
            document.getElementById('drum3').innerHTML = `<img src="${prize.img}" width="80">`;

            // Добавляем в live-ленту
            addLiveEntry(`🏆 ${playerName} выиграл ${prize.name}!`);
        } else {
            // Разные результаты
            results.forEach((prize, index) => {
                document.getElementById(`drum${index + 1}`).innerHTML = `<img src="${prize.img}" width="80">`;
            });
            prizeDisplay.textContent = "Увы, не повезло. Попробуйте снова!";
        }

        // Отключаем кнопку "СПИН" до конца КД
        spinBtn.disabled = true;
    }, 1000);
}

// ======================
// КД и попытки
// ======================
function checkCooldown() {
    if (cooldownEndTime > Date.now()) {
        const remainingTime = Math.ceil((cooldownEndTime - Date.now()) / 1000);
        cooldownDisplay.innerHTML = `<i class="fas fa-hourglass"></i> КД: <span id="cooldownTime">${remainingTime}</span> сек`;
        spinBtn.disabled = true;
    } else {
        cooldownDisplay.innerHTML = `<i class="fas fa-check"></i> КД окончен!`;
        spinBtn.disabled = false;
        cooldownEndTime = 0;
        localStorage.removeItem('grsCooldownEnd');
    }
}

// ======================
// Live-лента
// ======================
function addLiveEntry(message) {
    liveEntries.unshift({
        message,
        time: new Date().toLocaleTimeString()
    });
    liveEntries = liveEntries.slice(0, 10); // Оставляем последние 10 сообщений
    renderLiveTape();
}

function renderLiveTape() {
    liveTapeContent.innerHTML = liveEntries.map(entry =>
        `<div class="live-entry">${entry.time} | ${entry.message}</div>`
    ).join('');
}

// ======================
// Обновление UI
// ======================
function updateUI() {
    attemptsLeftDisplay.textContent = attemptsLeft;
    checkCooldown();
    renderLiveTape();
}

// ======================
// Запуск
// ======================
spinBtn.addEventListener('click', spinSlots);
init(); // Запускаем инициализацию
