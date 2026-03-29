let holes = document.querySelectorAll(".hole");
let scoreDisplay = document.getElementById("score");

let startBtn = document.getElementById("startBtn");
let resumeBtn = document.getElementById("resumeBtn");
let resetBtn = document.getElementById("resetBtn");

let score = 0;
let misses = 0;
let gameInterval;
let gameRunning = false;

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
    jugImg.src = 'charityjug.jpg';
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