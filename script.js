const aki = document.getElementById("aki");
const heart = document.getElementById("heart");
const canvas = document.querySelector(".canvas");
const catchSFX = document.getElementById("catch-sfx");
const winSFX = document.getElementById("win-sfx");

// Score tracking
let score = 0;
const maxScore = 10;
let gameRunning = true;

const scoreDisplay = document.createElement("div");
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "10px";
scoreDisplay.style.left = "50%";
scoreDisplay.style.transform = "translateX(-50%)";
scoreDisplay.style.fontSize = "32px";
scoreDisplay.style.fontWeight = "bold";
scoreDisplay.style.color = "white";
scoreDisplay.innerText = `Score: ${score}`;
canvas.appendChild(scoreDisplay);

let akiX;
const akiSpeed = 20;
let heartY = 0;
let heartX;
const heartSpeed = 3;

// Ensure initial positions after page load
window.onload = () => {
    akiX = (canvas.offsetWidth - aki.offsetWidth) / 2;
    aki.style.left = akiX + "px";

    heartX = Math.random() * (canvas.offsetWidth - heart.offsetWidth);
    heart.style.left = heartX + "px";
    heart.style.top = heartY + "px";
};

// Move aki left and right
document.addEventListener("keydown", (event) => {
    if (!gameRunning) return;

    if (event.key === "ArrowLeft") {
        akiX = Math.max(0, akiX - akiSpeed);
    } else if (event.key === "ArrowRight") {
        akiX = Math.min(canvas.offsetWidth, akiX + akiSpeed);
    }
    aki.style.left = akiX + "px";
});

// Function to move the heart down
function dropHeart() {
    if (!gameRunning) return;

    heartY += heartSpeed;
    heart.style.top = heartY + "px";

    // Collision detection (adjusted hitbox)
    const akiRect = aki.getBoundingClientRect();
    const heartRect = heart.getBoundingClientRect();

    // Shrinking aki's hitbox to avoid false collisions
    const akiHitbox = {
        top: akiRect.top + 150,
        bottom: akiRect.bottom - 10,
        left: akiRect.left + 100,
        right: akiRect.right - 100
    };

    if (
        heartRect.bottom >= akiHitbox.top &&
        heartRect.right >= akiHitbox.left &&
        heartRect.left <= akiHitbox.right
    ) {
        increaseScore();
        resetHeart();
        return;
    }

    if (heartY < canvas.offsetHeight - heart.offsetHeight) {
        requestAnimationFrame(dropHeart);
    } else {
        resetHeart();
    }
}

// Reset heart position after falling or catching
function resetHeart() {
    if (!gameRunning) return;

    heartY = 0;
    heartX = Math.random() * (canvas.offsetWidth - heart.offsetWidth);
    heart.style.left = heartX + "px";
    heart.style.top = heartY + "px";

    setTimeout(() => {
        requestAnimationFrame(dropHeart);
    }, 500);
}

// Increase score when heart is caught
function increaseScore() {
    score++;
    scoreDisplay.innerText = `Score: ${score}`;

    catchSFX.currentTime = 0; 
    catchSFX.play();

    if (score >= maxScore) {
        endGame();
        winSFX.currentTime = 0;
        winSFX.play();
    }
}

// End game and show popup
function endGame() {
    gameRunning = false;
    heart.style.display = "none"; // Hide the heart

    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
    popup.style.textAlign = "center";
    popup.style.zIndex = "1000";

    const question = document.createElement("p");
    question.innerText = "Will you be my Valentine's Date? 💖";
    question.style.fontSize = "2rem";
    question.style.fontWeight = "bold";
    question.style.marginBottom = "15px";
    popup.appendChild(question);

    const yesButton = document.createElement("button");
    yesButton.innerText = "Yes 💕";
    yesButton.style.margin = "5px";
    yesButton.style.fontSize = "2rem";
    yesButton.style.padding = "10px 20px";
    yesButton.style.backgroundColor = "#ff4081";
    yesButton.style.color = "white";
    yesButton.style.border = "none";
    yesButton.style.borderRadius = "5px";
    yesButton.style.cursor = "pointer";
    yesButton.onclick = () => {
        window.location.href = "yes.html"; // Redirect to yes.html
    };
    popup.appendChild(yesButton);

    document.body.appendChild(popup);
}

// Start game loop once
requestAnimationFrame(dropHeart);

document.addEventListener("DOMContentLoaded", () => {
    const bgMusic = document.getElementById("bg-music");

    // Play music when the user interacts (click, touch, or keypress)
    function enableMusic() {
        bgMusic.play();
        document.removeEventListener("click", enableMusic);
        document.removeEventListener("keydown", enableMusic);
        document.removeEventListener("touchstart", enableMusic);
    }

    document.addEventListener("click", enableMusic);
    document.addEventListener("keydown", enableMusic);
    document.addEventListener("touchstart", enableMusic);
});
