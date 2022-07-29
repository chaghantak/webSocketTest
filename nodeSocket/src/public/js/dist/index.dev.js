"use strict";

var socket = io();
var enterRoom = document.querySelector("#enter"); // enter div

var enterForm = enterRoom.querySelector("form"); // enter form

var seeRoom = enterRoom.querySelector("#see"); // enter button

var nick = document.querySelector("#nick"); // enter nick

var nickForm = nick.querySelector("form"); // enter form

var msgRoom = document.querySelector("#msg"); // enter msgroom

var msgForm = msgRoom.querySelector("form"); // enter form

var roomName; // blank

nickForm.hidden = true;
msgForm.hidden = true;

function addMessage(message) {
  var ul = msgRoom.querySelector("ul");
  var li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMsg() {
  nickForm.hidden = true;
  msgForm.hidden = false;
  var h3 = msgRoom.querySelector("h3");
  h3.innerText = "Room ".concat(roomName);
  msgForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = msgForm.querySelector("input");
    var value = input.value;
    socket.emit("message", {
      payload: input.value
    }, roomName, function () {
      addMessage("You: ".concat(value));
    });
    input.value = "";
  });
}

function handleNick() {
  seeRoom.hidden = true;
  enterForm.hidden = true;
  nickForm.hidden = false;
  console.log("server done");
  nickForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = nickForm.querySelector("input");
    socket.emit("nickname", {
      payload: input.value
    }, roomName, handleMsg);
  });
}

function enterSubmit(event) {
  event.preventDefault();
  var input = enterForm.querySelector("input"); // enter input

  socket.emit("enter_room", {
    payload: input.value
  }, handleNick);
  roomName = input.value;
  input.value = "";
}

enterForm.addEventListener("submit", enterSubmit);
socket.on("welcome", function (msg, userCount) {
  addMessage(msg);
  var h3 = msgRoom.querySelector("h3");
  h3.innerText = "Room ".concat(roomName, "(").concat(userCount, ")");
});
socket.on("exit", function (msg, userCount) {
  addMessage(msg);
  var h3 = msgRoom.querySelector("h3");
  h3.innerText = "Room ".concat(roomName, "(").concat(userCount, ")");
});
socket.on("message", function (msg) {
  addMessage(msg);
});
socket.on("room_change", function (rooms) {
  var roomList = enterRoom.querySelector("ul");
  roomList.innerHTML = "";

  if (rooms.length === 0) {
    return;
  }

  rooms.forEach(function (room) {
    var li = document.createElement("li");
    li.innerText = room;
    roomList.append(li); // last child append
  });
});
seeRoom.addEventListener("click", function () {
  socket.emit("click");
});
socket.on("click", function (rooms) {
  var roomList = enterRoom.querySelector("ul");
  roomList.innerHTML = "";

  if (rooms.length === 0) {
    return;
  }

  rooms.forEach(function (room) {
    var li = document.createElement("li");
    li.innerText = room;
    roomList.append(li); // last child append
  });
});