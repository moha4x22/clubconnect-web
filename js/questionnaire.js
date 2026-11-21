/* ==========================================================
   questionnaire.js  -  used only by questionnaire.html
   Collects feedback from students and checks what they type.

   Fields checked with our own JavaScript rules (regular expressions):
     1. Full name  - at least two words, letters only
     2. SQU email  - must end with squ.edu.om
     3. Phone      - Omani mobile number
     4. Comment    - length limits + no spam + at least 3 words
   Fields checked with simple "must choose" rules:
     5. Satisfaction (radio buttons)  6. Interests (check boxes)

   A regular expression (regex) is a pattern. regex.test(text)
   returns true when the text follows the pattern.
   ========================================================== */

/* ---------- SMALL HELPER: show green or red state on a field ---------- */
// Bootstrap draws a green border/message for "is-valid" and a red one for "is-invalid".
function setState(input, ok, message) {
  input.classList.remove("is-valid", "is-invalid");     // remove the old state first
  if (ok) {
    input.classList.add("is-valid");
  } else {
    input.classList.add("is-invalid");
    // The red message is the <div class="invalid-feedback"> right after the field
    var box = input.parentNode.querySelector(".invalid-feedback");
    if (box && message) {
      box.innerHTML = message;                           // write the exact reason
    }
  }
  return ok;
}

/* ---------- RULE 1: FULL NAME ---------- */
// ^ and $            : the whole text must match, from start to end
// [A-Za-z\u0600-\u06FF]{2,} : a word of 2 or more letters (English or Arabic letters)
// (?:[ '\-][A-Za-z\u0600-\u06FF]{2,})+ : one or more extra words, separated by a space, ' or -
const namePattern = /^[A-Za-z\u0600-\u06FF]{2,}(?:[ '\-][A-Za-z\u0600-\u06FF]{2,})+$/;

function validateName() {
  var input = document.getElementById("qName");
  var value = input.value.trim();
  return setState(input, namePattern.test(value),
    "Enter your full name: at least two words, letters only (example: Mohammed Alazri).");
}

/* ---------- RULE 2: SQU E-MAIL ---------- */
// [a-z0-9._%+-]+      : the name before @ (letters, digits and . _ % + -)
// @(?:student\.)?     : the @ sign, then optionally "student."
// squ\.edu\.om        : the university domain (the dots are escaped with \)
// the "i" at the end  : ignore upper/lower case
const emailPattern = /^[a-z0-9._%+-]+@(?:student\.)?squ\.edu\.om$/i;

function validateEmail() {
  var input = document.getElementById("qEmail");
  var value = input.value.trim();
  return setState(input, emailPattern.test(value),
    "Use your SQU e-mail (example: s138949@student.squ.edu.om).");
}

/* ---------- RULE 3: OMANI MOBILE NUMBER ---------- */
// (?:\+968[ -]?)?     : optional country code +968 (with an optional space or dash)
// [79]\d{3}           : Omani mobile numbers start with 7 or 9, followed by 3 digits
// [ -]?\d{4}          : optional space or dash, then the last 4 digits
const phonePattern = /^(?:\+968[ -]?)?[79]\d{3}[ -]?\d{4}$/;

function validatePhone() {
  var input = document.getElementById("qPhone");
  var value = input.value.trim();
  return setState(input, phonePattern.test(value),
    "Enter an Omani mobile number: 8 digits starting with 7 or 9 (example: 9123 4567).");
}

/* ---------- RULE 4: COMMENT (length + lookahead + word count) ---------- */
// (?!.*(.)\1{4,})     : a "negative lookahead": fails if any character is repeated 5 times in a row
//                       (blocks spam such as "aaaaaaaa")
// [\s\S]*             : any characters, including new lines
const noSpamPattern = /^(?!.*(.)\1{4,})[\s\S]*$/;
// \b\w+\b(?:\W+\b\w+\b){2,} : at least 3 separate words
const threeWordsPattern = /\b\w+\b(?:\W+\b\w+\b){2,}/;

function validateComment() {
  var input = document.getElementById("qComment");
  var value = input.value.trim();
  var message = "";

  // Check the rules one by one and keep the first problem found
  if (value.length < 20) {
    message = "Please write at least 20 characters (you wrote " + value.length + ").";
  } else if (value.length > 300) {
    message = "Please write at most 300 characters (you wrote " + value.length + ").";
  } else if (!noSpamPattern.test(value)) {
    message = "Please do not repeat the same character more than 4 times in a row.";
  } else if (!threeWordsPattern.test(value)) {
    message = "Please write at least 3 words.";
  }

  // message is still empty only when every rule passed
  document.getElementById("commentCount").innerHTML = value.length + " / 300";
  return setState(input, message == "", message);
}

/* ---------- RULE 5: SATISFACTION (radio buttons) ---------- */
// One radio button must be selected
function validateRating() {
  var radios = document.getElementsByName("rating");
  var chosen = false;
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      chosen = true;
    }
  }
  // Show or hide our red message (class d-none hides it)
  var msg = document.getElementById("ratingMsg");
  if (chosen) { msg.classList.add("d-none"); } else { msg.classList.remove("d-none"); }
  return chosen;
}

/* ---------- RULE 6: INTERESTS (check boxes) ---------- */
// At least one check box must be ticked
function validateInterests() {
  var boxes = document.getElementsByName("interest");
  var count = 0;
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      count++;
    }
  }
  var msg = document.getElementById("interestMsg");
  if (count > 0) { msg.classList.add("d-none"); } else { msg.classList.remove("d-none"); }
  return count > 0;
}

/* ---------- SUBMIT BUTTON ---------- */
// Called from the form tag:  onsubmit="return submitQuestionnaire(event)"
function submitQuestionnaire(event) {
  event.preventDefault();                  // we decide if the form is accepted

  // Run ALL checks (do not stop at the first error, so every problem is shown)
  var a = validateName();
  var b = validateEmail();
  var c = validatePhone();
  var d = validateComment();
  var e = validateRating();
  var f = validateInterests();

  if (a && b && c && d && e && f) {
    // All fields are correct: write a summary in the "Thank you" window
    var rating = document.querySelector("input[name='rating']:checked").value;
    var interests = [];
    var boxes = document.getElementsByName("interest");
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) { interests.push(boxes[i].value); }
    }
    document.getElementById("thanksBody").innerHTML =
      "<p>Thank you, <strong>" + clean(document.getElementById("qName").value.trim()) + "</strong>!</p>" +
      "<ul class='list-group'>" +
      "<li class='list-group-item'>Favourite club: " + clean(document.getElementById("qClub").value) + "</li>" +
      "<li class='list-group-item'>Satisfaction: " + rating + " out of 5</li>" +
      "<li class='list-group-item'>Interests: " + clean(interests.join(", ")) + "</li>" +
      "</ul>";
    // Click the hidden button that opens the Bootstrap modal
    document.getElementById("openThanks").click();
    resetQuestionnaire();
  } else {
    // Scroll up to the first red field so the user can see the problem
    var firstBad = document.querySelector(".is-invalid");
    if (firstBad) { firstBad.focus(); }
  }
  return false;
}

/* ---------- RESET: clear the form and all green/red marks ---------- */
function resetQuestionnaire() {
  document.getElementById("questionnaireForm").reset();
  var marked = document.querySelectorAll(".is-valid, .is-invalid");
  for (var i = 0; i < marked.length; i++) {
    marked[i].classList.remove("is-valid", "is-invalid");
  }
  document.getElementById("ratingMsg").classList.add("d-none");
  document.getElementById("interestMsg").classList.add("d-none");
  document.getElementById("commentCount").innerHTML = "0 / 300";
}
