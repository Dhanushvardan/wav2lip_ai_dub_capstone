from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")




@socketio.on("connect")
def handle_connect():
    emit("me", request.sid)

@socketio.on("disconnect")
def handle_disconnect():
    emit("callEnded", broadcast=True)

@socketio.on("callUser")
def handle_call_user(data):
    emit("callUser", {"signal": data["signalData"], "from": data["from"], "name": data["name"]}, room=data["userToCall"])

@socketio.on("answerCall")
def handle_answer_call(data):
    emit("callAccepted", data["signal"], room=data["to"])

if __name__ == "__main__":
    socketio.run(app, port=5000,allow_unsafe_werkzeug=True)
    print("running")
