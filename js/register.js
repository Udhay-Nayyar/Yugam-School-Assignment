import { auth, db, friendly } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { validateForm, banner, busy } from "./validators.js";





const $ = (id) => document.getElementById(id);
// console.log(id)


$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm(["name", "email", "password"])) return;
  busy($("go"), true);
  try {
    const { user } = await createUserWithEmailAndPassword(auth, $("email").value.trim(), $("password").value);
    await updateProfile(user, { displayName: $("name").value.trim() });
    await setDoc(doc(db, "users", user.uid), { name: $("name").value.trim(), email: user.email });
    // One-time hand-off so the profile page can prefill the password.
    // It is read and deleted immediately there; it is never kept long-term.
    sessionStorage.setItem("pw", $("password").value);
    location.href = "profile.html";
  } catch (err) {
    banner($("msg"), friendly(err), "fail");
    busy($("go"), false, "Create account");
  }
});
