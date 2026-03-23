let holes = document.querySelectorAll(".hole");
let scoreDisplay = document.getElementById("score");
let startBtn = document.getElementById("startBtn");

let score = 0;
let gameInterval;

// random hole
function randomHole() {
    return holes[Math.floor(Math.random() * holes.length)];
}

// create mole
function showMole() {
    let hole = randomHole();

    // prevent stacking multiple moles
    if (hole.querySelector(".mole")) return;

    let mole = document.createElement("div");
    mole.classList.add("mole");
    mole.textContent = "F";

    // click event
    mole.addEventListener("click", () => {
        score++;
        scoreDisplay.textContent = score;
        mole.remove();
    });

    hole.appendChild(mole);

    // remove after time
    setTimeout(() => {
        mole.remove();
    }, 800);
}

// start game
startBtn.addEventListener("click", () => {
    score = 0;
    scoreDisplay.textContent = score;

    clearInterval(gameInterval);

    gameInterval = setInterval(showMole, 700);
});