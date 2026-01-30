// ------------------------------
// GAME STATE
// ------------------------------

let balance = 100;
const goal = 5000;
let goalCode = "---";

const colors = ["red", "white", "black"];

// ------------------------------
// ELEMENTS
// ------------------------------

const balanceDisplay = document.getElementById("balance-display");
const goalCodeEl = document.getElementById("goal-code");

const betInput = document.getElementById("betInput");
const colorInput = document.getElementById("colorInput");
const numberInput = document.getElementById("numberInput");

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");

const message = document.getElementById("message");

const goalBarFill = document.getElementById("goal-bar-fill");

// ------------------------------
// INITIAL SETUP
// ------------------------------

updateBalance();
updateGoalBar();
updateGoalCode();

// ------------------------------
// HELPERS
// ------------------------------

function updateBalance() {
  balanceDisplay.textContent = `Balance: ${balance} tabs`;
}

function updateGoalBar() {
  const fill = Math.min(balance / goal, 1);
  goalBarFill.style.width = (fill * 100) + "%";
}

function updateGoalCode() {
  goalCodeEl.textContent = "Code: " + goalCode;
}

function log(msg) {
  message.innerHTML = msg;
}

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

// ------------------------------
// CONFETTI
// ------------------------------

function baguetteConfetti() {
  const container = document.getElementById("confetti-container");

  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "baguette";

      const icons = ["🥖", "🥐"];
      el.textContent = icons[Math.floor(Math.random() * icons.length)];

      el.style.left = Math.random() * 100 + "vw";
      el.style.fontSize = (1.5 + Math.random() * 2.5) + "rem";
      el.style.animationDuration = (4 + Math.random() * 3) + "s";

      container.appendChild(el);
      setTimeout(() => el.remove(), 8000);
    }, i * 20);
  }
}

// ------------------------------
// MAIN GAME LOGIC
// ------------------------------

playBtn.addEventListener("click", () => {

  if (balance <= 0) {
    log("You have no tabs left.");
    return;
  }

  let bet = parseInt(betInput.value);

  // INVALID BET → PENALTY
  if (isNaN(bet) || bet <= 0 || bet > balance) {
    const penalty = Math.floor(balance * 0.10);
    balance -= penalty;
    updateBalance();
    updateGoalBar();
    log(`Invalid bet! You lost ${penalty} tabs.`);
    return;
  }

  // SUBTRACT BET ONCE
  balance -= bet;

  const userColor = colorInput.value.toLowerCase();
  const userNumber = parseInt(numberInput.value);

  const correctColor = randomColor();
  const correctNumber = randomNumber();

  // WINNING LOGIC
  if (userColor === correctColor && userNumber === correctNumber) {
    balance += bet * 3;
    log(`JACKPOT! You hit BOTH! +${bet * 3} tabs`);
  } else if (userColor === correctColor) {
    const win = Math.floor(bet * 1.5);
    balance += win;
    log(`Correct color! +${win} tabs`);
  } else if (userNumber === correctNumber) {
    balance += bet * 2;
    log(`Correct number! +${bet * 2} tabs`);
  } else {
    log(`No win this round.`);
  }

  updateBalance();
  updateGoalBar();

  // SHOW CORRECT ANSWERS
  message.innerHTML += `<br><span style="opacity:0.7;">Correct: ${correctColor}, ${correctNumber}</span>`;

  // GOAL REACHED
  if (balance >= goal && goalCode === "---") {
    baguetteConfetti();
    goalCode = "49201"; // your code
    updateGoalCode();
    log("🎉 You've reached your goal! Code unlocked!");
  }

  // GAME OVER
  if (balance <= 0) {
    log("You lost all your tabs.");
  }
});

// ------------------------------
// RESTART
// ------------------------------

restartBtn.addEventListener("click", () => {
  balance = 100;
  goalCode = "---";
  updateBalance();
  updateGoalBar();
  updateGoalCode();
  log("Game restarted.");
});
