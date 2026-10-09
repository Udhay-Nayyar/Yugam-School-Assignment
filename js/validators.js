// All validation rules live here so every page uses the same ones.
export const rules = {
  name:     { re: /^[A-Za-z]+(?: [A-Za-z]+)*$/, msg: "Use letters only (no numbers or special characters)." },
  password: { re: /^(?=.*[A-Za-z])(?=.*\d).+$/, msg: "Use at least one letter and one number." },
  mobile:   { re: /^\d{10}$/, msg: "Enter exactly 10 digits." },
  // letters/digits, with at most one special character, e.g. john_doe1
    // letters + digits with exactly one special character (no spaces), e.g. john_doe1
  username: { re: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]*[^A-Za-z0-9\s][A-Za-z0-9]*$/, msg: "Use letters and digits with exactly one special character (e.g. john_doe1)." },
  email:    { re: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: "Enter a valid email, e.g. name@example.com." }
};

export function check(field, value) {
  if (!value.trim()) return "This field is required.";
  return rules[field].re.test(value) ? "" : rules[field].msg;
}

// Validate the listed fields, paint inline errors, return true if all pass.
export function validateForm(fields) {
  let ok = true;
  for (const f of fields) {
    const input = document.getElementById(f);
    const error = check(f, input.value);
    document.getElementById("e-" + f).textContent = error;
    input.classList.toggle("bad", !!error);
    input.setAttribute("aria-invalid", !!error);
    if (error) ok = false;
  }
  return ok;
}

export function banner(el, text, type) {
  el.textContent = text; el.className = "banner " + type; el.hidden = false;
}
export function busy(btn, on, label) { btn.disabled = on; btn.textContent = on ? "Please wait…" : label; }