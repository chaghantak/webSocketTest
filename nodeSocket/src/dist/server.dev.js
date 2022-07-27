"use strict";

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _socket = _interopRequireDefault(require("socket.io"));

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


var io = (0, _socket["default"])(httpServer); // const sockets = []; // fake db
// const wss = new WebSocket.Server({ server }); // webSocket
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "unKnown";
//   console.log("Connected to Browser✅");
//   socket.on("close", () => {
//     console.log("Disconnected to Browser❌");
//   });
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}:${message.payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = message.payload;
//         break;
//     }
//   });
// }); // send to frontend

var handleListen = function handleListen() {
  return console.log("Listening on http://localhost:3000");
};

httpServer.listen(3000, handleListen);