let holes = document.querySelectorAll(".hole");
let scoreDisplay = document.getElementById("score");

let startBtn = document.getElementById("startBtn");
let resumeBtn = document.getElementById("resumeBtn");
let resetBtn = document.getElementById("resetBtn");

let score = 0;
let misses = 0;
let gameInterval;
let gameRunning = false;

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
    mole.textContent = "F";

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

        if (score >= 5) {
            endGame("🎉 You win! Score reached 5!");
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

        if (score >= 5) {
            endGame("🎉 You win! Score reached 5!");
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
        gameInterval = setInterval(showMole, 700);
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
    gameRunning = true;

    scoreDisplay.textContent = score;

    clearInterval(gameInterval);
    gameInterval = setInterval(showMole, 700);
}

// reset helper
function resetGame() {
    gameRunning = false;
    clearInterval(gameInterval);

    score = 0;
    misses = 0;
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