let holes = document.querySelectorAll(".hole");
let scoreDisplay = document.getElementById("score");

let startBtn = document.getElementById("startBtn");
let resumeBtn = document.getElementById("resumeBtn");
let resetBtn = document.getElementById("resetBtn");

let score = 0;
let misses = 0;
let gameInterval;
let gameRunning = false;
let currentLevel = 1;
let gameSpeed = 700; // Initial speed in milliseconds

// Level thresholds
const levelThresholds = {
    1: 3,  // Level 1: reach score 3
    2: 7,  // Level 2: reach score 5
    3: 10   // Level 3: reach score 7 (final)
};

// Speed for each level
const levelSpeeds = {
    1: 700,  // Level 1 speed
    2: 500,  // Level 2 speed (faster)
    3: 350   // Level 3 speed (fastest)
};

// Avatar upload handler
let avatarUpload = document.getElementById("avatar-upload");
let avatarImg = document.getElementById("avatar-img");

avatarUpload.addEventListener("change", (e) => {
    let file = e.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = (event) => {
            avatarImg.src = event.target.result;
            localStorage.setItem("userAvatar", event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load saved avatar on page load
window.addEventListener("load", () => {
    let savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
        avatarImg.src = savedAvatar;
    }
});

// Avatar option selection
let avatarOptions = document.querySelectorAll(".avatar-option");
avatarOptions.forEach(option => {
    option.addEventListener("click", (e) => {
        let avatarSrc = option.getAttribute("data-avatar");
        avatarImg.src = avatarSrc;
        localStorage.setItem("userAvatar", avatarSrc);
    });
});

// random hole
function randomHole() {
    return holes[Math.floor(Math.random() * holes.length)];
}

// show mole
function showMole() {
    if (!gameRunning) return;

    let hole = randomHole();

    if (hole.querySelector(".mole")) return;

    let mole = document.createElement("div");
    mole.classList.add("mole");

    // jug image as the mole
    let jugImg = document.createElement('img');
    jugImg.src = 'charityjug2.png';
    jugImg.alt = 'jug';
    jugImg.classList.add('jug');
    mole.appendChild(jugImg);

    let clicked = false;

    function cleanup() {
        hole.removeEventListener('click', onHoleClick);
    }

    function onHoleClick() {
        if (!gameRunning) return;
        if (!hole.querySelector('.mole')) return;
        clicked = true;
        score++;
        scoreDisplay.textContent = score;
        cleanup();
        mole.remove();

        // Check if current level threshold is reached
        if (score >= levelThresholds[currentLevel]) {
            if (currentLevel < 3) {
                // Advance to next level
                currentLevel++;
                gameSpeed = levelSpeeds[currentLevel];
                alert(`🚀 Level ${currentLevel}! Game is getting faster!`);
                
                // Restart game loop with new speed
                clearInterval(gameInterval);
                gameInterval = setInterval(showMole, gameSpeed);
            } else {
                // Level 3 complete - game won
                endGame("🎉 You win! You completed all levels!");
            }
        }
    }

    mole.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!gameRunning) return;

        clicked = true;
        score++;
        scoreDisplay.textContent = score;
        cleanup();
        mole.remove();

        // Check if current level threshold is reached
        if (score >= levelThresholds[currentLevel]) {
            if (currentLevel < 3) {
                // Advance to next level
                currentLevel++;
                gameSpeed = levelSpeeds[currentLevel];
                alert(`🚀 Level ${currentLevel}! Game is getting faster!`);
                
                // Restart game loop with new speed
                clearInterval(gameInterval);
                gameInterval = setInterval(showMole, gameSpeed);
            } else {
                // Level 3 complete - game won
                endGame("🎉 You win! You completed all levels!");
            }
        }
    });

    hole.addEventListener('click', onHoleClick);
    hole.appendChild(mole);

    setTimeout(() => {
        if (!clicked) {
            misses++;

            if (misses >= 3) {
                endGame("💀 Game Over! You missed 3 moles.");
            }
        }
        cleanup();
        mole.remove();
    }, 800);
}

// START GAME
startBtn.addEventListener("click", () => {
    startGame();
});

// RESUME GAME
resumeBtn.addEventListener("click", () => {
    if (!gameRunning) {
        gameRunning = true;
        gameInterval = setInterval(showMole, gameSpeed);
    }
});

// RESET GAME
resetBtn.addEventListener("click", () => {
    resetGame();
});

// start helper
function startGame() {
    score = 0;
    misses = 0;
    currentLevel = 1;
    gameSpeed = levelSpeeds[currentLevel];
    gameRunning = true;

    scoreDisplay.textContent = score;

    clearInterval(gameInterval);
    gameInterval = setInterval(showMole, gameSpeed);
}

// reset helper
function resetGame() {
    gameRunning = false;
    clearInterval(gameInterval);

    score = 0;
    misses = 0;
    currentLevel = 1;
    gameSpeed = levelSpeeds[currentLevel];
    scoreDisplay.textContent = score;

    // remove all moles from screen
    document.querySelectorAll(".mole").forEach(mole => mole.remove());
}

// stop game
function endGame(message) {
    gameRunning = false;
    clearInterval(gameInterval);

    setTimeout(() => {
        alert(message);
    }, 100);
}