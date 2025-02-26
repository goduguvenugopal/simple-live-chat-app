const socket = io();

// DOM elements
const user_message = document.getElementById("user-message");
const send_message = document.getElementById("send-message");
const messages_card = document.getElementById("messages-card");
const modal_box = document.getElementById("modal-box");
const user_name = document.getElementById("user-name");
const add_name_btn = document.getElementById("add-name-btn");
const log_out = document.getElementById("logout");
const room = document.getElementById("room-name");

let person_name;
let room_Name;

// Checking user name and room name in localStorage
window.addEventListener("load", () => {
  const userName = localStorage.getItem("userName");
  const roomName = localStorage.getItem("roomName"); // FIXED: Now gets roomName correctly

  if (userName && roomName) {
    person_name = JSON.parse(userName);
    room_Name = JSON.parse(roomName);
    
    socket.emit("join-room", { person_name, room_Name });
    modal_box.style.display = "none";
  } else {
    modal_box.style.display = "block";
  }
});

// Storing user name and room name in localStorage
add_name_btn.addEventListener("click", () => {
  const userName = user_name.value.trim();
  const roomName = room.value.trim();

  if (userName && roomName) {
    person_name = userName;
    room_Name = roomName;
    
    socket.emit("join-room", { person_name, room_Name });

    localStorage.setItem("userName", JSON.stringify(userName));
    localStorage.setItem("roomName", JSON.stringify(roomName));
    
    modal_box.style.display = "none";
  } else {
    alert("Please Enter Your Name and Room Name");
  }
});

// Removing user name and room from local storage (Logout)
log_out.addEventListener("click", () => {
  localStorage.removeItem("userName");
  localStorage.removeItem("roomName");
  
  modal_box.style.display = "block";
});

// Sending message function
send_message.addEventListener("click", () => {
  if (user_message.value.trim() === "") {
    alert("Please enter a message");
  } else {
    const message = user_message.value.trim();
    const formattedMessage = `${person_name} 👉 ${message}`;
    
    socket.emit("send-message", { room_Name, message: formattedMessage });
    
    user_message.value = "";
    user_message.focus();
  }
});

// Receiving messages from server
socket.on("message", (message) => {
  const newDiv = document.createElement("div");
  newDiv.className = "shadow rounded p-2 mb-2 text-capitalize";
  newDiv.textContent = message;
  
  messages_card.appendChild(newDiv);
  messages_card.scrollTop = messages_card.scrollHeight;
});

// Share App function
const shareApp = async () => {
  try {
    await navigator.share({
      title: "Simple Live Chat App",
      text: "Simple Live Chat App is a real-time messaging platform that allows users to communicate instantly.",
      url: "https://simple-live-chat-app.onrender.com/",
    });
  } catch (error) {
    console.log("Error sharing:", error);
  }
};
