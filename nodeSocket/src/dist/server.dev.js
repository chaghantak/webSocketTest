"use strict";

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _socket = require("socket.io");

var _adminUi = require("@socket.io/admin-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import WebSocket from "ws";
// server
var app = (0, _express["default"])();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", _express["default"]["static"](__dirname + "/public"));
app.get("/", function (req, res) {
  return res.render("home");
});
app.get("/*", function (req, res) {
  return res.redirect("/");
}); // url -> go to home
// 3000 port makes http&ws

var httpServer = _http["default"].createServer(app); // http


var wsServer = new _socket.Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});
(0, _adminUi.instrument)(wsServer, {
  auth: false
});

function publicRooms() {
  var _wsServer$sockets$ada = wsServer.sockets.adapter,
      sids = _wsServer$sockets$ada.sids,
      rooms = _wsServer$sockets$ada.rooms;
  var publicRooms = [];
  rooms.forEach(function (_, key) {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms; // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
}

function roomLength(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName).size;
}

wsServer.on("connection", function (socket) {
  socket.onAny(function (event) {
    console.log("Socket Event: ".concat(event));
  });
  socket.on("enter_room", function (room, done) {
    socket.join(room.payload);
    done();
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("nickname", function (nickname, room, done) {
    socket["nickname"] = nickname.payload;
    socket.to(room).emit("welcome", "".concat(socket.nickname, "\uB2D8\uC774 \uCC38\uAC00\uD588\uB2E4"), roomLength(room));
    done();
  });
  socket.on("message", function (msg, room, done) {
    socket.to(room).emit("message", "".concat(socket.nickname, ":").concat(msg.payload));
    done();
  });
  socket.on("disconnecting", function () {
    socket.rooms.forEach(function (room) {
      socket.to(room).emit("exit", "".concat(socket.nickname, "\uB2D8\uC774 \uB098\uAC14\uB2E4"), roomLength(room) - 1);
    });
  });
  socket.on("disconnect", function () {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("click", function () {
    wsServer.sockets.emit("click", publicRooms());
  });
});

var handleListen = function handleListen() {
  return console.log("Listening on http://localhost:3000");
};

httpServer.listen(3000, handleListen);