
document.body.addEventListener("click", async (event) => {
    const response1 = await fetch("http://localhost:8080/api/me", {
        method: "GET",
        headers: {
            "X-Session-Id": sessionStorage.getItem("sessionId"),
            "Content-Type": "application/json"
        }
    });
    const me = await response1.json();

    const clickedImg = event.target;
    me.avatar = clickedImg.id

    const response = await fetch("http://localhost:8080/api/new_user", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(me)
    });
    if (!response.ok) {
        console.log("failed to change avatar")
        return;
    } else {
        console.log("changed avatar to " + clickedImg.id);
        sessionStorage.setItem("avatar", clickedImg.id);
    }
    window.location.href = "../HTML/profile.html"
})