/* ==========================================================
   clubs.js  -  used only by clubs.html
   Object type 1: Club
   Array: clubs  (the data of Table 1 from Part II)
   Function 1: showClubs()  - writes the rows of the table
   Also: add a new club, search clubs, show club details
   ========================================================== */

/* ---------- OBJECT TYPE 1: Club (constructor function) ---------- */
function Club(name, category, description, meets, members) {
  this.name = name;               // club name
  this.category = category;       // Academic, Culture, Sports or Volunteering
  this.description = description; // what the club does
  this.meets = meets;             // meeting days
  this.members = members;         // number of members (a number)

  // Method: returns true when the search text is found in the name,
  // category, description or meeting days of this club.
  this.matches = function (text) {
    var all = (this.name + " " + this.category + " " + this.description + " " + this.meets).toLowerCase();
    return all.indexOf(text.toLowerCase()) != -1;   // indexOf gives -1 when the text is not found
  };
}

/* ---------- ARRAY of Club objects, filled with the real data of Part II ---------- */
const clubs = [
  new Club("Coding Club",      "Academic",     "Workshops on programming and web development", "Sunday and Thursday",    48),
  new Club("Debate Club",      "Academic",     "Public speaking and debate practice",          "Monday",                 32),
  new Club("Photography Club", "Culture",      "Photography and video activities",             "Monday and Wednesday",   41),
  new Club("Art Club",         "Culture",      "Drawing, painting and exhibitions",            "Tuesday",                27),
  new Club("Football Club",    "Sports",       "Weekly matches and training",                  "Tuesday",                60),
  new Club("Volunteer Group",  "Volunteering", "Community and campus service activities",      "Wednesday and Thursday", 55)
];

// Chooses a Bootstrap badge colour for each category (switch statement)
function badgeColour(category) {
  switch (category) {
    case "Academic":     return "bg-primary";
    case "Culture":      return "bg-info text-dark";
    case "Sports":       return "bg-success";
    case "Volunteering": return "bg-warning text-dark";
    default:             return "bg-secondary";
  }
}

/* ---------- FUNCTION 1: display the clubs in the table ---------- */
// "list" is the array to show: the whole "clubs" array, or only the search results.
function showClubs(list) {
  var rows = "";                      // the HTML of all rows is collected in this string
  var total = 0;                      // total number of members of the clubs shown

  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    total = total + c.members;
    // clubs.indexOf(c) is the position of this club in the main array;
    // the Details button sends it to fillClubModal() so the correct club is shown.
    rows += "<tr>" +
      "<td>" + (i + 1) + "</td>" +
      "<td class='fw-bold'>" + clean(c.name) + "</td>" +
      "<td><span class='badge " + badgeColour(c.category) + "'>" + clean(c.category) + "</span></td>" +
      "<td>" + clean(c.description) + "</td>" +
      "<td>" + clean(c.meets) + "</td>" +
      "<td class='text-end'>" + c.members + "</td>" +
      "<td><button type='button' class='btn btn-sm btn-outline-primary' data-bs-toggle='modal' " +
      "data-bs-target='#clubModal' onclick='fillClubModal(" + clubs.indexOf(c) + ")'>Details</button></td>" +
      "</tr>";
  }

  // When nothing matches, show one row with a message
  if (list.length == 0) {
    rows = "<tr><td colspan='7' class='text-center text-danger fw-bold'>No clubs found.</td></tr>";
  }

  // Write the rows and the totals into the empty table (innerHTML replaces the old content)
  document.getElementById("clubBody").innerHTML = rows;
  document.getElementById("clubTotal").innerHTML = total;
  document.getElementById("clubCount").innerHTML = "Showing " + list.length + " of " + clubs.length + " clubs";
}

/* ---------- ADD A NEW CLUB (form: addClubForm) ---------- */
function addClub(event) {
  event.preventDefault();                       // do not reload the page
  var form = event.target;

  // Stop if a field is empty or wrong; Bootstrap shows the red messages
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return false;
  }

  // Read the values typed by the user. Number() converts the text to a number.
  var newClub = new Club(
    document.getElementById("newName").value.trim(),
    document.getElementById("newCategory").value,
    document.getElementById("newDescription").value.trim(),
    document.getElementById("newMeets").value.trim(),
    Number(document.getElementById("newMembers").value)
  );

  clubs.push(newClub);                          // add the object at the end of the array
  showClubs(clubs);                             // call function 1 again to update the table

  form.reset();                                 // empty the form
  form.classList.remove("was-validated");       // remove the green/red borders
  document.getElementById("clubSearch").value = "";

  // Show the green success message for 3 seconds
  var ok = document.getElementById("clubAdded");
  ok.classList.remove("d-none");
  setTimeout(function () { ok.classList.add("d-none"); }, 3000);
  return false;
}

/* ---------- SEARCH (text box clubSearch) ---------- */
function searchClubs() {
  var text = document.getElementById("clubSearch").value.trim();
  var results = [];                             // new empty array for the matching clubs
  for (var i = 0; i < clubs.length; i++) {
    if (clubs[i].matches(text)) {               // uses the method of the Club object
      results.push(clubs[i]);
    }
  }
  showClubs(results);                           // show only the matching clubs
}

// The "Show all" button
function resetClubSearch() {
  document.getElementById("clubSearch").value = "";
  showClubs(clubs);
}

/* ---------- DETAILS WINDOW (Bootstrap modal) ---------- */
// Fills the modal with the data of the club at position "index"
function fillClubModal(index) {
  var c = clubs[index];
  document.getElementById("clubModalTitle").innerHTML = clean(c.name);
  document.getElementById("clubModalBody").innerHTML =
    "<p><strong>Category:</strong> " + clean(c.category) + "</p>" +
    "<p><strong>What we do:</strong> " + clean(c.description) + "</p>" +
    "<p><strong>Meeting days:</strong> " + clean(c.meets) + "</p>" +
    "<p><strong>Members:</strong> " + c.members + "</p>";
}

// Show all clubs when the page opens
showClubs(clubs);
