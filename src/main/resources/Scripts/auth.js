document.addEventListener("DOMContentLoaded", () => {
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

        const login = document.getElementById("login");
        const signup = document.getElementById("signUp");
        const loginDrop = document.getElementById("loginDrop");
        const signupDrop = document.getElementById("signUpDrop");

        if (currentUser) {
            // User is logged in → hide login/signup, show logout
            if (login) login.classList.add("hidden");
            if (signup) signup.classList.add("hidden");
            if (loginDrop) loginDrop.classList.add("hidden");
            if (signupDrop) signupDrop.classList.add("hidden");

            console.log("Welcome" + currentUser.username);
        } else {
            // User not logged in → show login/signup, hide logout
            if (login) login.classList.remove("hidden");
            if (signup) signup.classList.remove("hidden");
            if (signupDrop) signupDrop.classList.remove("hidden");
            if (loginDrop) loginDrop.classList.remove("hidden");
        }
    });