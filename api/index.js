const express = require("express")

const app = express()
const http = require("http")
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "https://wav2lip-ai-dub-capstone.onrender.com",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    socket.emit("me", socket.id)

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })


})

server.listen(5000, () => {
    console.log("server started");
    console.log("nodemon added");
})