const userName = document.getElementById("user");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
let sessionId = null;
let currentUser = null;

submit.addEventListener("click", async(e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/user/", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body : JSON.stringify({username : userName.value, password : password.value})
    });
    if(!response.ok) {
        console.log("log in failed")
    }

    const user = await response.json();
    sessionId = user.sessionId;
    currentUser = {username : user.username};
    console.log("Logged in as " + currentUser.username);
})