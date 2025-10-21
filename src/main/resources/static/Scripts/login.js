const userName = document.getElementById("user");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
let sessionId = null;
let currentUser = null;
let avatar = null;

submit.addEventListener("click", async(e) => {
    e.preventDefault();
    const response = await fetch("/api/user", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body : JSON.stringify({username : userName.value, password : password.value})
    });
    if(!response.ok) {
        console.log("log in failed")
        return;
    }

    const user = await response.json();
    sessionId = user.sessionId;
    currentUser = {userId : Number(user.userId), username : user.username};
    avatar = user.avatar;
    console.log("Logged in as " + currentUser.username + "with id of " + currentUser.userId);
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    sessionStorage.setItem("sessionId", sessionId);
    sessionStorage.setItem("avatar", avatar);
    window.location.href="../index.html";
})