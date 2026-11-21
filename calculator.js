/* ==========================================================
   calculator.js  -  used only by calculator.html
   Membership and event cost calculator for ClubConnect.

   Why this page exists: students who join clubs pay a small
   membership fee for each club and buy tickets for the events.
   The calculator shows the total bill before they join.

   FORMULA (all amounts are in Omani Rial, OMR):
     clubFees      = (sum of the chosen club fees) x type factor
     ticketCost    = tickets x 2
     freeTickets   = Math.floor(tickets / 4)        (every 4th ticket is free)
     bundle        = 15% of clubFees when 3 or more clubs are chosen
     subtotal      = clubFees + ticketCost + T-shirt - freeTicketsValue - bundle
     senior        = 10% of subtotal when age is 60 or more
     serviceFee    = 5% of the amount after discounts, but 0 for students
                     who join at least one club, and for ages 60 and above
     TOTAL         = amount after discounts + serviceFee
   ========================================================== */

// Yearly fee of each club in OMR (an object: name -> value). Sample data.
var fees = { coding: 5, debate: 3, photography: 6, art: 4, football: 8, volunteer: 0 };

// Fixed prices (const = cannot be changed later)
const TICKET_PRICE = 2;      // price of one event ticket
const TSHIRT_PRICE = 4;      // price of the club T-shirt
const BUNDLE_RATE = 0.15;    // 15% off club fees for 3 or more clubs
const SENIOR_RATE = 0.10;    // 10% off for ages 60 and above
const SERVICE_RATE = 0.05;   // 5% service fee

// Formats a number with 3 decimals, the way OMR amounts are written (2.500)
function omr(value) {
  return value.toFixed(3) + " OMR";
}

// Called from the form tag:  onsubmit="return calculate(event)"
function calculate(event) {
  event.preventDefault();
  var form = event.target;

  // Age and ticket boxes have min/max rules in the HTML; stop if they are wrong
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return false;
  }

  /* ----- 1. READ THE INPUTS ----- */
  var age = Number(document.getElementById("age").value);
  var tickets = Number(document.getElementById("tickets").value);
  var type = document.getElementById("memberType").value;        // student, staff or guest
  var wantsShirt = document.getElementById("tshirt").checked;    // true or false

  /* ----- 2. MEMBERSHIP TYPE FACTOR (switch statement) ----- */
  var factor;
  switch (type) {
    case "student": factor = 1;   break;    // students pay the normal fee
    case "staff":   factor = 1.5; break;    // SQU staff pay 1.5 times
    default:        factor = 2;             // guests pay double
  }

  /* ----- 3. CLUB FEES ----- */
  var clubCount = 0;       // how many clubs were ticked
  var clubSum = 0;         // sum of their fees
  var chosen = "";         // names of the clubs, for the bill
  for (var key in fees) {                                  // key = coding, debate, ...
    if (document.getElementById("club_" + key).checked) {
      clubCount++;
      clubSum = clubSum + fees[key];
      chosen = chosen + key + " ";
    }
  }
  var clubFees = clubSum * factor;

  /* ----- 4. TICKETS ----- */
  var ticketCost = tickets * TICKET_PRICE;
  var freeTickets = Math.floor(tickets / 4);               // whole groups of 4 tickets
  var freeValue = freeTickets * TICKET_PRICE;
  var toNextFree = 4 - (tickets % 4);                      // % gives the remainder

  /* ----- 5. T-SHIRT ----- */
  var shirt = 0;
  if (wantsShirt) {
    shirt = TSHIRT_PRICE;
  }

  /* ----- 6. NOTHING SELECTED? show a warning and stop ----- */
  if (clubCount == 0 && tickets == 0 && !wantsShirt) {
    document.getElementById("result").innerHTML =
      "<div class='alert alert-warning'>Please choose at least one club, ticket or T-shirt.</div>";
    return false;
  }

  /* ----- 7. DISCOUNTS (relational and logical operators) ----- */
  var bundle = 0;
  if (clubCount >= 3) {                                    // relational operator >=
    bundle = clubFees * BUNDLE_RATE;
  }

  var subtotal = clubFees + ticketCost + shirt - freeValue - bundle;

  var senior = 0;
  if (age >= 60) {
    senior = subtotal * SENIOR_RATE;
  }
  var afterDiscounts = subtotal - senior;

  /* ----- 8. SERVICE FEE (logical operators && and ||) ----- */
  var serviceFee = afterDiscounts * SERVICE_RATE;
  // No service fee for a student who joins at least one club, OR for ages 60 and above
  if ((type == "student" && clubCount >= 1) || age >= 60) {
    serviceFee = 0;
  }

  var total = afterDiscounts + serviceFee;

  /* ----- 9. BUILD THE BILL (a Bootstrap table) ----- */
  var bill = "<table class='table table-striped'><thead class='table-dark'><tr><th>Item</th><th class='text-end'>Amount</th></tr></thead><tbody>";
  bill += "<tr><td>Club fees (" + clubCount + " club(s) x " + factor + " for " + type + ")</td><td class='text-end'>" + omr(clubFees) + "</td></tr>";
  bill += "<tr><td>Event tickets (" + tickets + " x " + TICKET_PRICE + " OMR)</td><td class='text-end'>" + omr(ticketCost) + "</td></tr>";
  if (wantsShirt) {
    bill += "<tr><td>Club T-shirt</td><td class='text-end'>" + omr(shirt) + "</td></tr>";
  }
  if (freeTickets > 0) {
    bill += "<tr class='table-success'><td>Free tickets (" + freeTickets + ")</td><td class='text-end'>- " + omr(freeValue) + "</td></tr>";
  }
  if (bundle > 0) {
    bill += "<tr class='table-success'><td>Bundle discount (3 or more clubs, 15%)</td><td class='text-end'>- " + omr(bundle) + "</td></tr>";
  }
  if (senior > 0) {
    bill += "<tr class='table-success'><td>Senior discount (age 60+, 10%)</td><td class='text-end'>- " + omr(senior) + "</td></tr>";
  }
  bill += "<tr><td>Service fee (5%)" + (serviceFee == 0 ? " - waived" : "") + "</td><td class='text-end'>" + omr(serviceFee) + "</td></tr>";
  bill += "<tr class='table-primary fw-bold'><td>TOTAL</td><td class='text-end'>" + omr(total) + "</td></tr>";
  bill += "</tbody></table>";

  // A helpful hint about the free-ticket offer
  if (tickets > 0 && freeTickets == 0) {
    bill += "<div class='alert alert-info'>Buy " + toNextFree + " more ticket(s) to get one ticket free.</div>";
  }

  document.getElementById("result").innerHTML = bill;
  return false;
}

// The Clear button: empties the form and the bill
function clearCalculator() {
  document.getElementById("calcForm").reset();
  document.getElementById("calcForm").classList.remove("was-validated");
  document.getElementById("result").innerHTML = "";
}
