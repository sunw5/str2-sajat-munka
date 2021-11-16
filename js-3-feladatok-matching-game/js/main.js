const clock = document.querySelector("#gameClock");
const status = document.querySelector("#status");
const cardsContainer = document.querySelector(".cards-container");
const cardIcons = ["🍋", "🍓", "🌰", "🍄", "🍇"];
let cards;
let match = [];
let intervalId = 0;
let moves = 0;

function createCard(icon) {
  let card = document.createElement("div");
  let cardFront = document.createElement("div");
  card.classList.add("card", "card-back");
  cardFront.classList.add("card-front");
  cardsContainer.appendChild(card);
  card.appendChild(cardFront);
}

function createAllCards() {
  [...cardIcons, ...cardIcons].forEach(() => createCard());
}

function addListener() {
  cards = [...document.querySelectorAll(".card")];

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.add("card-rotate", "disabled");
      match.push(card);
      handleMatch();
    });
  });
}

function handleMatch() {
  moves++;
  if (moves === 1) {
    startTimer()
  };
  if (match.length === 2) {
    cardsContainer.classList.toggle("disabled");
    let icon0 = match[0].querySelector(".card-front").dataset.icon;
    let icon1 = match[1].querySelector(".card-front").dataset.icon;
    if (icon0 !== icon1) {
      setTimeout(() => {
        match[0].classList.toggle("disabled");
        match[1].classList.toggle("disabled");
        match[0].classList.toggle("card-rotate");
        match[1].classList.toggle("card-rotate");
        match = [];
        cardsContainer.classList.toggle("disabled");
      }, 1000);
    } else {
      match = [];
      cardsContainer.classList.toggle("disabled");
      checkWin();
    }
  }
}

function checkWin() {
  if (cards.every((card) => card.classList.contains("disabled"))) {
    console.log("Win");
    stopTimer();
    newGame();
  }
}
// Fisher–Yates shuffle
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function shuffleCardsIcons() {
  let cardsFront = [...document.querySelectorAll(".card-front")];
  let shuffled = shuffle([...cardIcons, ...cardIcons]);
  cardsFront.forEach((cardFront, index) => {
    cardFront.dataset.icon = shuffled[index];
  });
}

function startTimer() {
  let start = {
    min: 0,
    sec: 0
  };
  intervalId = setInterval(() => {
    if (start.sec < 59) {
      start.sec++;
    } else {
      start.min++;
      start.sec = 0;
    }

    clock.textContent = `${("0" + start.min).slice(-2)}:${(
      "0" + start.sec
    ).slice(-2)}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

function resetTimer() {
  clock.textContent = '00:00';
}

function newGame() {
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.remove('card-rotate', 'disabled');
    });
    moves = 0;
    resetTimer();
    shuffleCardsIcons();
  }, 5000)
}

function initGame() {
  createAllCards();
  shuffleCardsIcons();
  addListener();
}

initGame();