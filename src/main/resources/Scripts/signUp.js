const userName = document.getElementById("user");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const feedback = document.getElementById("username-feedback");
let debounceTimeout = null;


userName.addEventListener("input", async () => {
    clearTimeout(debounceTimeout);
    const input = userName.value.trim();
    if(!input) {
        //this is where I put the output to html
        feedback.textContent = "";
        return;
    }

    debounceTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/findUser?username=${encodeURIComponent(input)}`);
            const data = await response.json();

            if(data.exists) {
                //edit output to html to tell user that username is taken
                feedback.textContent = "Username is taken";
                feedback.style.color = "red";
                submit.disabled = true;
                submit.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");

            }
            else {
                // edit output to html
                feedback.textContent = "Username is valid";
                feedback.style.color = "green";
                submit.disabled = false;
                submit.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
            }

        } catch (err) {
            console.error("Error checking username", err);

        }
    }, 300);
})

submit.addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/new_user", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: userName.value, password: password.value})
    });
    if (!response.ok) {
        console.log("log in failed")
        return;
    }

    console.log("Successfully signed up");
    window.location.href="login.html";

})