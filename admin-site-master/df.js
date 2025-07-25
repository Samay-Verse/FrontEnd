let username = "";

function joinChat() {
    username = document.getElementById("username").value.trim();
    if (!username) return alert("Enter your name");

    document.getElementById("login-box").classList.add("hidden");
    document.getElementById("chat-container").classList.remove("hidden");

    socket = io();

    socket.emit("join", username);

    socket.on("message", (data) => {
        const chatBox = document.getElementById("chat-box");
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<strong>${data.user}:</strong> ${data.msg}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

function sendMessage() {
    const msgInput = document.getElementById("message-input");
    const message = msgInput.value.trim();
    if (!message) return;

    socket.emit("message", { user: username, msg: message });
    msgInput.value = "";
}