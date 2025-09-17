const userName = document.getElementById("user");
const password = document.getElementById("password");
const submit = document.getElementById("submit");

submit.addEventListener("click", async(e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/user/" + userName.value);
    const user = await response.json();
    if(user) {
        if(password.value === user.password) {
            console.log("Log in successful");
        }
    }
})