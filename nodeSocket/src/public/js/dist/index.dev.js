"use strict";

// front
var messageUl = document.querySelector("ul");
var nickForm = document.querySelector("#nickname");
var messageForm = document.querySelector("#message");
var socket = new WebSocket("ws://".concat(window.location.host));

function makeMessage(type, payload) {
  var msg = {
    type: type,
    payload: payload
  };
  return JSON.stringify(msg);
} // receive to server


socket.addEventListener("open", function () {
  console.log("Connect to Server✅");
});
socket.addEventListener("close", function () {
  console.log("DisConnect to Server❌");
});
socket.addEventListener("message", function (message) {
  console.log("New Message: ".concat(message.data, " from Server"));
  var li = document.createElement("li");
  li.innerText = message.data;
  messageUl.append(li);
});
nickForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
});
messageForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
});