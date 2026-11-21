/* ==========================================================
   common.js  -  shared by every page that has a form
   Bootstrap shows green/red feedback only when the <form>
   has the class "was-validated". The HTML attributes
   (required, pattern, min, max ...) decide what is valid.
   ========================================================== */

// Called from the form tag:  onsubmit="return checkForm(event)"
function checkForm(event) {
  // event.target is the form that was submitted
  var form = event.target;

  // checkValidity() returns true only if every field passes its HTML rules
  if (!form.checkValidity()) {
    // stop the browser from sending the form
    event.preventDefault();
    // turn on Bootstrap's green/red borders and feedback messages
    form.classList.add("was-validated");
    return false;
  }
  // everything is valid: let the form be sent normally
  return true;
}

// Escapes the characters < > & so text typed by a user can be put
// inside innerHTML safely (it is shown as text, never as HTML code).
function clean(text) {
  text = String(text);
  text = text.replace(/&/g, "&amp;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  return text;
}
