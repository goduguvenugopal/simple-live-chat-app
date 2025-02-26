const socket = io();
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

// checking user name and room name in localStorage if available user name the modal box display none
window.addEventListener("load", () => {
  const userName = localStorage.getItem("userName");
  const roomName = localStorage.getItem("userName");

  if (userName && roomName) {
    const parseName = JSON.parse(userName);
    const parseRoomName = JSON.parse(roomName);
    person_name = parseName;
    room_Name = parseRoomName;
    modal_box.style.display = "none";
  } else {
    modal_box.style.display = "block";
  }
});

// modal box rendering conditionally and storing user name and room name in localStorage
add_name_btn.addEventListener("click", () => {
  const userName = user_name.value.trim();
  const roomName = room.value.trim();
  if (userName && roomName) {
    socket.emit("join-room", { person_name, roomName });
    localStorage.setItem("userName", JSON.stringify(userName));
    localStorage.setItem("roomName", JSON.stringify(roomName));
    modal_box.style.display = "none";
    person_name = userName;
    room_Name = roomName;
  } else {
    alert("Please Enter Your Name and Room Name");
  }
});

// remove the user name in local storage
log_out.addEventListener("click", () => {
  localStorage.removeItem("userName");
  localStorage.removeItem("roomName");
  modal_box.style.display = "block";
});

// sending message function
send_message.addEventListener("click", () => {
  if (user_message.value === "") {
    alert("Please enter message");
  } else {
    const message = user_message.value;
    const concatStr = `${person_name} 👉 ${message}`;
    socket.emit("send-message", concatStr);
    user_message.value = "";
    user_message.focus();
  }
});

// displaying messages with socket.on from server
socket.on("message", (message) => {
  const newDiv = document.createElement("div");
  newDiv.className = "shadow rounded p-2 mb-2 text-capitalize";
  newDiv.textContent = message;
  messages_card.appendChild(newDiv);
  messages_card.scrollTop = messages_card.scrollHeight;
});

// share App function
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
