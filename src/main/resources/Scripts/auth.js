document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    const login = document.getElementById("login");
    const signup = document.getElementById("signUp");
    const loginDrop = document.getElementById("loginDrop");
    const signupDrop = document.getElementById("signUpDrop");
    const logout = document.getElementById("logout");
    const logoutDrop = document.getElementById("logoutDrop");

    if (currentUser) {
        // User is logged in → hide login/signup, show logout
        if (login) login.classList.add("hidden");
        if (signup) signup.classList.add("hidden");
        if (loginDrop) loginDrop.classList.add("hidden");
        if (signupDrop) signupDrop.classList.add("hidden");
        if (logout) logout.classList.remove("hidden");
        if (logoutDrop) logoutDrop.classList.remove("hidden");


        console.log("Welcome" + currentUser.username);
    } else {
        // User not logged in → show login/signup, hide logout
        if (login) login.classList.remove("hidden");
        if (signup) signup.classList.remove("hidden");
        if (signupDrop) signupDrop.classList.remove("hidden");
        if (loginDrop) loginDrop.classList.remove("hidden");
        if (logout) logout.classList.add("hidden");
        if (logoutDrop) logoutDrop.classList.add("hidden");
    }
});

const logoutLink = document.getElementById("logout");
const logoutDrop = document.getElementById("logoutDrop");

function logout() {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("sessionId");
    window.location.href = "../index.html";
}

logoutLink.addEventListener('click', logout);
logoutDrop.addEventListener('click', logout);