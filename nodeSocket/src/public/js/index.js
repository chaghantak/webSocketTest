const socket = io();

const enterRoom = document.querySelector("#enter"); // enter div
const enterForm = enterRoom.querySelector("form"); // enter form
const seeRoom = enterRoom.querySelector("#see"); // enter button

const nick = document.querySelector("#nick"); // enter nick
const nickForm = nick.querySelector("form"); // enter form

const msgRoom = document.querySelector("#msg"); // enter msgroom
const msgForm = msgRoom.querySelector("form"); // enter form
let roomName; // blank

nickForm.hidden = true;
msgForm.hidden = true;

function addMessage(message) {
  const ul = msgRoom.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMsg() {
  nickForm.hidden = true;
  msgForm.hidden = false;
  const h3 = msgRoom.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  msgForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = msgForm.querySelector("input");
    const value = input.value;
    socket.emit("message", { payload: input.value }, roomName, () => {
      addMessage(`You: ${value}`);
    });
    input.value = "";
  });
}

function handleNick() {
  seeRoom.hidden = true;
  enterForm.hidden = true;
  nickForm.hidden = false;
  console.log("server done");
  nickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.emit("nickname", { payload: input.value }, roomName, handleMsg);
  });
}

function enterSubmit(event) {
  event.preventDefault();
  const input = enterForm.querySelector("input"); // enter input
  socket.emit("enter_room", { payload: input.value }, handleNick);
  roomName = input.value;
  input.value = "";
}

enterForm.addEventListener("submit", enterSubmit);
socket.on("welcome", (msg, userCount) => {
  addMessage(msg);
  const h3 = msgRoom.querySelector("h3");
  h3.innerText = `Room ${roomName}(${userCount})`;
});

socket.on("exit", (msg, userCount) => {
  addMessage(msg);
  const h3 = msgRoom.querySelector("h3");
  h3.innerText = `Room ${roomName}(${userCount})`;
});

socket.on("message", (msg) => {
  addMessage(msg);
});

socket.on("room_change", (rooms) => {
  const roomList = enterRoom.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li); // last child append
  });
});

seeRoom.addEventListener("click", () => {
  socket.emit("click");
});
socket.on("click", (rooms) => {
  const roomList = enterRoom.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li); // last child append
  });
});
