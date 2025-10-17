document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    const login = document.getElementById("login");
    const signup = document.getElementById("signUp");
    const loginDrop = document.getElementById("loginDrop");
    const signupDrop = document.getElementById("signUpDrop");
    const logout = document.getElementById("logout");
    const logoutDrop = document.getElementById("logoutDrop");
    const profile = document.getElementById("profile");
    const profileDrop = document.getElementById("profileDrop");
    const joinGame = document.getElementById("joinGame");
    const joinGameDrop = document.getElementById("joinGameDrop");
    const playGame = document.getElementById("playGame");

    if (currentUser) {
        // User is logged in → hide login/signup, show logout
        if (login) login.classList.add("hidden");
        if (signup) signup.classList.add("hidden");
        if (loginDrop) loginDrop.classList.add("hidden");
        if (signupDrop) signupDrop.classList.add("hidden");
        if (logout) logout.classList.remove("hidden");
        if (logoutDrop) logoutDrop.classList.remove("hidden");
        if (profile) profile.classList.remove("hidden");
        if (profileDrop) profileDrop.classList.remove("hidden");
        if (joinGame) joinGame.classList.remove("hidden");
        if (joinGameDrop) joinGameDrop.classList.remove("hidden");

        const path = window.location.pathname;

        if (path.endsWith("/index.html")) {
            playGame.href = 'HTML/joinGame.html';
            profile.innerHTML = `<img src="images/avatars/${sessionStorage.getItem("avatar")}.png" alt="profile" height="35" width="35"/>`;
        } else {
            profile.innerHTML = `<img src="../images/avatars/${sessionStorage.getItem("avatar")}.png" alt="profile" height="35" width="35"/>`;
        }



        console.log("Welcome" + currentUser.username);
    } else {
        // User not logged in → show login/signup, hide logout
        if (login) login.classList.remove("hidden");
        if (signup) signup.classList.remove("hidden");
        if (signupDrop) signupDrop.classList.remove("hidden");
        if (loginDrop) loginDrop.classList.remove("hidden");
        if (logout) logout.classList.add("hidden");
        if (logoutDrop) logoutDrop.classList.add("hidden");
        if(profile) profile.classList.add("hidden");
        if(profileDrop) profileDrop.classList.add("hidden");
    }
});

const logoutLink = document.getElementById("logout");
const logoutDrop = document.getElementById("logoutDrop");

function logout() {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("sessionId");
    window.location.href = "../index.html";
}

async function submitIssue(event) {
    event.preventDefault();

    console.log("issue func called")
    let page = document.getElementById("page").value;
    let type = document.getElementById("issueType").value;
    let issue = document.getElementById("issueText").value;

    const res = await fetch("http://localhost:8080/api/create-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: page, type: type, issue: issue, username: sessionStorage.currentUser.username })
    });

    const msg = await res.text();
    alert("Thank you for submitting your feedback!");
}

logoutLink.addEventListener('click', logout);
logoutDrop.addEventListener('click', logout);