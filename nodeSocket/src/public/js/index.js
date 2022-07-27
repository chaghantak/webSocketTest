// front
const messageUl = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

// receive to server
socket.addEventListener("open", () => {
  console.log("Connect to Server✅");
});

socket.addEventListener("close", () => {
  console.log("DisConnect to Server❌");
});

socket.addEventListener("message", (message) => {
  console.log(`New Message: ${message.data} from Server`);
  const li = document.createElement("li");
  li.innerText = message.data;
  messageUl.append(li);
});

nickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
});
