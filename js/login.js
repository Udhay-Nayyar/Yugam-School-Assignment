import { auth, friendly } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { validateForm, banner, busy } from "./validators.js";

const $ = (id) => document.getElementById(id);

$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm(["email", "password"])) return;
  busy($("go"), true);
  try {
    await signInWithEmailAndPassword(auth, $("email").value.trim(), $("password").value);
    location.href = "profile.html";
  } catch (err) {
    banner($("msg"), friendly(err), "fail");
    busy($("go"), false, "Log in");
  }
});
