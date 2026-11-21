/* ==========================================================
   fun.js  -  used only by funpage.html
   Game: "Club Match" (a memory game)
   There are 12 face-down cards: 6 club pictures, each twice.
   Click two cards. If the pictures are the same club, the
   pair stays open. Find all 6 pairs with as few moves as you can.

   Dynamic HTML used: the cards are created with innerHTML,
   pictures change with .src, buttons are switched off with
   .disabled, and messages appear/disappear by changing classes.
   ========================================================== */

// The six clubs: each has a picture file and a name
const clubCards = [
  { file: "images/club-coding.png",      name: "Coding Club" },
  { file: "images/club-debate.png",      name: "Debate Club" },
  { file: "images/club-photography.png", name: "Photography Club" },
  { file: "images/club-art.png",         name: "Art Club" },
  { file: "images/club-football.png",    name: "Football Club" },
  { file: "images/club-volunteer.png",   name: "Volunteer Group" }
];

var deck = [];            // the 12 cards in their shuffled order
var firstCard = -1;       // position of the first card flipped (-1 = none)
var secondCard = -1;      // position of the second card flipped
var locked = false;       // true while two different cards are shown, so no third card can be clicked
var moves = 0;            // number of pairs the player tried
var pairsFound = 0;       // number of pairs matched
var seconds = 0;          // seconds since the game started
var clock;                // the timer that counts seconds

// Mixes the deck: for every position, swap with a random earlier position
function shuffle(list) {
  for (var i = list.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));   // random whole number from 0 to i
    var temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list;
}

// Starts a new game (also called by the "New game" button)
function startGame() {
  // Put every club in the deck twice, then shuffle
  deck = [];
  for (var i = 0; i < clubCards.length; i++) {
    deck.push(clubCards[i]);
    deck.push(clubCards[i]);
  }
  shuffle(deck);

  // Reset all the counters
  firstCard = -1;
  secondCard = -1;
  locked = false;
  moves = 0;
  pairsFound = 0;
  seconds = 0;
  clearInterval(clock);
  clock = setInterval(tick, 1000);

  // Build the 12 cards as HTML buttons with the "?" picture on them
  var html = "";
  for (var k = 0; k < deck.length; k++) {
    html += "<div class='col-4 col-md-3'>" +
      "<button type='button' id='btn" + k + "' class='btn btn-outline-primary p-1 w-100' onclick='flipCard(" + k + ")'>" +
      "<img id='card" + k + "' src='images/card-back.png' class='img-fluid rounded' alt='Hidden card'>" +
      "</button></div>";
  }
  document.getElementById("board").innerHTML = html;

  // Hide the winner message and show the zero counters
  document.getElementById("winBox").classList.add("d-none");
  document.getElementById("message").innerHTML = "Click a card to start.";
  showScore();
}

// Runs every second to count the time
function tick() {
  seconds++;
  showScore();
}

// Writes moves, pairs and time into the score badges
function showScore() {
  document.getElementById("moves").innerHTML = moves;
  document.getElementById("pairs").innerHTML = pairsFound + " / " + clubCards.length;
  document.getElementById("time").innerHTML = seconds + " s";
}

// Called when the player clicks card number "i"
function flipCard(i) {
  // Ignore the click if two cards are already open, or this card is the same one clicked twice
  if (locked || i == firstCard) {
    return;
  }

  // Show the picture of the card
  document.getElementById("card" + i).src = deck[i].file;
  document.getElementById("card" + i).alt = deck[i].name;

  if (firstCard == -1) {
    // This is the first card of the pair
    firstCard = i;
    document.getElementById("message").innerHTML = "Now find the same club.";
    return;
  }

  // This is the second card of the pair
  secondCard = i;
  moves++;
  locked = true;

  if (deck[firstCard].name == deck[secondCard].name) {
    // MATCH: switch both buttons off and colour them green
    markMatched(firstCard);
    markMatched(secondCard);
    pairsFound++;
    document.getElementById("message").innerHTML = "Great! You found the " + deck[i].name + ".";
    firstCard = -1;
    secondCard = -1;
    locked = false;
    if (pairsFound == clubCards.length) {
      winGame();
    }
  } else {
    // NO MATCH: wait 0.8 second so the player can see, then turn both cards back
    document.getElementById("message").innerHTML = "Not a pair. Try again.";
    setTimeout(hideCards, 800);
  }
  showScore();
}

// Turns a matched card into a green, disabled button
function markMatched(i) {
  var button = document.getElementById("btn" + i);
  button.disabled = true;
  button.classList.remove("btn-outline-primary");
  button.classList.add("btn-success");
}

// Turns the two wrong cards face down again
function hideCards() {
  document.getElementById("card" + firstCard).src = "images/card-back.png";
  document.getElementById("card" + secondCard).src = "images/card-back.png";
  firstCard = -1;
  secondCard = -1;
  locked = false;
}

// All pairs found: stop the clock and show the winner message
function winGame() {
  clearInterval(clock);
  document.getElementById("winText").innerHTML =
    "You found all " + clubCards.length + " clubs in " + moves + " moves and " + seconds + " seconds!";
  document.getElementById("winBox").classList.remove("d-none");
  document.getElementById("message").innerHTML = "Well done!";
}

startGame();   // begin the first game when the page opens
