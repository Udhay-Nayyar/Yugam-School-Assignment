import { auth, db, friendly } from "./firebase.js";
import { onAuthStateChanged, signOut, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { validateForm, banner, busy } from "./validators.js";

const $ = (id) => document.getElementById(id);
const FIELDS = ["name", "password", "mobile", "username", "email"];
let user;
let savedName = "";

// Auth guard: logged-out visitors are sent to the login page.
onAuthStateChanged(auth, async (u) => {
  if (!u) return (location.href = "login.html");
  user = u;
  $("name").value = u.displayName || "";
  $("email").value = u.email || "";
  $("password").value = sessionStorage.getItem("pw") || "";
  sessionStorage.removeItem("pw"); // delete right after use
   savedName = u.displayName || "";
  try {
    const snap = await getDoc(doc(db, "users", u.uid));
    if (snap.exists()) {
      savedName = snap.data().name || savedName;
      $("mobile").value = snap.data().mobile || "";
      $("username").value = snap.data().username || "";
    }
  } catch { /* profile data is optional on first load */ }
});

// Compare name, email and password with the real account.
// Returns true when all three match; otherwise marks the fields that don't.
async function matchesAccount() {
  let ok = true;
  const mismatch = (id, msg) => {
    $("e-" + id).textContent = msg;
    $(id).classList.add("bad");
    ok = false;
  };

  // const snap = await getDoc(doc(db, "users", user.uid));
  // const savedName = (snap.exists() && snap.data().name) || user.displayName || "";
  if ($("name").value.trim() !== savedName) mismatch("name", "This does not match the name you registered with.");
  if ($("email").value.trim().toLowerCase() !== user.email.toLowerCase()) mismatch("email", "This does not match your account email.");

  // Firebase never reveals a password, so we ask it to verify the one typed in.
  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, $("password").value));
  } catch (err) {
    if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
      mismatch("password", "This is not the password for your account.");
    } else throw err;
  }
  return ok;
}

$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm(FIELDS)) return banner($("msg"), "Fix the highlighted fields and validate again.", "fail");
  busy($("go"), true);
  try {
    if (!(await matchesAccount())) {
      banner($("msg"), "Some details do not match your account.", "fail");
    } else {
      // Only mobile and username are saved. The password is never saved.
      await setDoc(doc(db, "users", user.uid), {
        mobile: $("mobile").value, username: $("username").value
      }, { merge: true });
      banner($("msg"), "All details are valid.", "ok");
    }
  } catch (err) {
    banner($("msg"), friendly(err), "fail");
  } finally {
    busy($("go"), false, "Validate");
  }
});

// Editing any field clears the old result; fields already marked wrong re-check live.
$("form").addEventListener("input", (e) => {
  $("msg").hidden = true;
  if (e.target.classList.contains("bad")) validateForm([e.target.id]);
});

$("logout").addEventListener("click", async () => {
  await signOut(auth);
  location.href = "login.html";
});