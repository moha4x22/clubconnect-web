/* ==========================================================
   events.js  -  used only by events.html
   Object type 2: ClubEvent
   Array: events  (the data of Table 2 from Part II)
   Function 2: showEvents()  - writes the rows of the table
   Also: add a new event, search events
   (The name ClubEvent is used because "Event" already exists in JavaScript.)
   ========================================================== */

/* ---------- OBJECT TYPE 2: ClubEvent (constructor function) ---------- */
function ClubEvent(date, time, title, club, place, seats) {
  this.date = date;     // text such as "Sunday 01/11/2026"
  this.time = time;     // text such as "4:00 PM"
  this.title = title;   // name of the event
  this.club = club;     // club that organises the event
  this.place = place;   // where it takes place
  this.seats = seats;   // number of seats (a number)

  // Method: true when the search text appears in any of the text fields
  this.matches = function (text) {
    var all = (this.date + " " + this.time + " " + this.title + " " + this.club + " " + this.place).toLowerCase();
    return all.indexOf(text.toLowerCase()) != -1;
  };
}

/* ---------- ARRAY of ClubEvent objects, filled with the real data of Part II ---------- */
const events = [
  new ClubEvent("Sunday 01/11/2026",    "4:00 PM", "Photo Walk",                       "Photography Club", "Library Square",  30),
  new ClubEvent("Monday 02/11/2026",    "5:00 PM", "Intro to Web Development Workshop", "Coding Club",      "Computer Lab",    25),
  new ClubEvent("Monday 02/11/2026",    "7:00 PM", "Public Speaking Night",            "Debate Club",      "Main Hall",       60),
  new ClubEvent("Wednesday 04/11/2026", "4:30 PM", "Friendly Football Match",          "Football Club",    "Campus Field",    40),
  new ClubEvent("Thursday 05/11/2026",  "3:00 PM", "Campus Clean-up Day",              "Volunteer Group",  "Main Campus",     50),
  new ClubEvent("Sunday 08/11/2026",    "6:00 PM", "Art Exhibition Opening",           "Art Club",         "Student Center",  80)
];

/* ---------- FUNCTION 2: display the events in the table ---------- */
// "list" is the array to show: the whole "events" array, or only the search results.
function showEvents(list) {
  var rows = "";          // HTML of all rows
  var totalSeats = 0;     // total seats of the events shown

  for (var i = 0; i < list.length; i++) {
    var e = list[i];
    totalSeats = totalSeats + e.seats;
    rows += "<tr>" +
      "<td>" + clean(e.date) + "</td>" +
      "<td>" + clean(e.time) + "</td>" +
      "<td class='fw-bold'>" + clean(e.title) + "</td>" +
      "<td>" + clean(e.club) + "</td>" +
      "<td>" + clean(e.place) + "</td>" +
      "<td class='text-end'>" + e.seats + "</td>" +
      "</tr>";
  }

  if (list.length == 0) {
    rows = "<tr><td colspan='6' class='text-center text-danger fw-bold'>No events found.</td></tr>";
  }

  document.getElementById("eventBody").innerHTML = rows;
  document.getElementById("eventTotal").innerHTML = totalSeats;
  document.getElementById("eventCount").innerHTML = "Showing " + list.length + " of " + events.length + " events";
}

/* ---------- HELPER FUNCTIONS FOR THE ADD FORM ---------- */

// Turns "2026-11-10" (from the date box) into "Tuesday 10/11/2026"
function formatDate(value) {
  var parts = value.split("-");                                   // ["2026", "11", "10"]
  // new Date(year, month, day): months start at 0, so we subtract 1
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return dayNames[d.getDay()] + " " + pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
}

// Turns "17:00" (from the time box) into "5:00 PM"
function formatTime(value) {
  var parts = value.split(":");
  var hours = Number(parts[0]);
  var ampm = "AM";
  if (hours >= 12) { ampm = "PM"; }
  if (hours > 12) { hours = hours - 12; }
  if (hours == 0) { hours = 12; }
  return hours + ":" + parts[1] + " " + ampm;
}

// Adds a leading zero to numbers below 10
function pad(n) {
  if (n < 10) { return "0" + n; }
  return String(n);
}

/* ---------- ADD A NEW EVENT (form: addEventForm) ---------- */
function addEvent(event) {
  event.preventDefault();
  var form = event.target;

  // Stop if something is missing; Bootstrap shows the red messages
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return false;
  }

  var newEvent = new ClubEvent(
    formatDate(document.getElementById("evDate").value),
    formatTime(document.getElementById("evTime").value),
    document.getElementById("evTitle").value.trim(),
    document.getElementById("evClub").value,
    document.getElementById("evPlace").value.trim(),
    Number(document.getElementById("evSeats").value)
  );

  events.push(newEvent);            // add to the array
  showEvents(events);               // call function 2 again to update the table

  form.reset();
  form.classList.remove("was-validated");
  document.getElementById("eventSearch").value = "";

  var ok = document.getElementById("eventAdded");
  ok.classList.remove("d-none");
  setTimeout(function () { ok.classList.add("d-none"); }, 3000);
  return false;
}

/* ---------- SEARCH (text box eventSearch) ---------- */
function searchEvents() {
  var text = document.getElementById("eventSearch").value.trim();
  var results = [];
  for (var i = 0; i < events.length; i++) {
    if (events[i].matches(text)) {
      results.push(events[i]);
    }
  }
  showEvents(results);
}

function resetEventSearch() {
  document.getElementById("eventSearch").value = "";
  showEvents(events);
}

// Show all events when the page opens
showEvents(events);
