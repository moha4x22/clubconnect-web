/* ==========================================================
   home.js  -  used only by index.html
   Part 1: scrolling welcome banner with live date and time
   Part 2: photo gallery that changes photo every 3 seconds
   ========================================================== */

/* ---------- PART 1: SCROLLING BANNER ---------- */

var companyName = "ClubConnect";   // company name used in the message
var bannerPos = 0;                 // current distance (in pixels) from the left edge

// Adds a leading zero to numbers below 10  (5 -> "05")
function pad(n) {
  if (n < 10) {
    return "0" + n;
  }
  return String(n);
}

// Builds the welcome message with the CURRENT date and time
// and writes it inside the banner <span id="bannerText">
function updateBannerText() {
  var now = new Date();                       // current date and time
  var hours = now.getHours();                 // 0 - 23
  var ampm = "AM";
  if (hours >= 12) {                          // afternoon and evening
    ampm = "PM";
  }
  if (hours > 12) {                           // convert 13-23 to 1-11
    hours = hours - 12;
  }
  if (hours == 0) {                           // midnight is 12 AM
    hours = 12;
  }
  var time = hours + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds()) + " " + ampm;

  document.getElementById("bannerText").innerHTML =
    "Welcome to the " + companyName + " website! Today is " +
    now.toDateString() + ", and the time is " + time;
}

// Moves the banner text 2 pixels to the right each time it is called.
// When the text has left the screen on the right side, it starts again
// from the left side, so the message keeps moving from left to right.
function moveBanner() {
  var box = document.getElementById("bannerBox");     // the full-width bar
  var text = document.getElementById("bannerText");   // the moving text
  bannerPos = bannerPos + 2;
  if (bannerPos > box.offsetWidth) {
    bannerPos = -text.offsetWidth;                    // restart just outside the left edge
  }
  text.style.left = bannerPos + "px";                 // the text has class position-relative, so "left" moves it
}

updateBannerText();                       // show the message immediately
setInterval(updateBannerText, 1000);      // refresh the clock every 1 second
setInterval(moveBanner, 25);              // move the text every 25 milliseconds

/* ---------- PART 2: PHOTO GALLERY ---------- */

// The list of photos. Each item is an object with a file name and a caption.
const photos = [
  { file: "images/club-coding.png",      caption: "Coding Club - workshops on programming and web development" },
  { file: "images/club-debate.png",      caption: "Debate Club - public speaking and debate practice" },
  { file: "images/club-photography.png", caption: "Photography Club - photo walks and video activities" },
  { file: "images/club-art.png",         caption: "Art Club - drawing, painting and exhibitions" },
  { file: "images/club-football.png",    caption: "Football Club - weekly matches and training" },
  { file: "images/club-volunteer.png",   caption: "Volunteer Group - community and campus service" }
];

var photoIndex = 0;        // which photo is shown now (0 = first)
var galleryTimer;          // remembers the timer so we can restart it

// Shows the photo at position photoIndex
function showPhoto() {
  var p = photos[photoIndex];
  document.getElementById("galleryImg").src = p.file;
  document.getElementById("galleryImg").alt = p.caption;
  document.getElementById("galleryCaption").innerHTML = p.caption;
  document.getElementById("galleryCount").innerHTML = "Photo " + (photoIndex + 1) + " of " + photos.length;
}

// Moves forward by "step" photos (1 = next, -1 = previous).
// The % operator makes the index wrap around: after the last photo comes the first.
function changePhoto(step) {
  photoIndex = (photoIndex + step + photos.length) % photos.length;
  showPhoto();
}

// Used by the Previous / Next buttons: change the photo, then restart
// the timer so the new photo also stays for the full 3 seconds.
function manualChange(step) {
  clearInterval(galleryTimer);
  changePhoto(step);
  galleryTimer = setInterval(autoChange, 3000);
}

function autoChange() {
  changePhoto(1);
}

showPhoto();                                      // show the first photo
galleryTimer = setInterval(autoChange, 3000);     // 3000 ms = each photo stays 3 seconds
