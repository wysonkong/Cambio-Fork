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

            }
            else {
                // edit output to html
                feedback.textContent = "Username is valid";
                feedback.style.color = "green";
            }

        } catch (err) {
            console.error("Error checking username", err);

        }
    }, 300);

})