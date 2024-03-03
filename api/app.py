from flask import Flask, request
from flask_socketio import SocketIO, emit
import eventlet
eventlet.monkey_patch()


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="https://frontend-cap.onrender.com",message_queue='redis://')




@socketio.on("connect")
def handle_connect():
    emit("me", request.sid)
    print("Client is connected" + request.sid)

@socketio.on("disconnect")
def handle_disconnect():
    emit("callEnded", broadcast=True)

@socketio.on("callUser")
def handle_call_user(data):
    emit("callUser", {"signal": data["signalData"], "from": data["from"], "name": data["name"]}, room=data["userToCall"])
    print("call user request is received")

@socketio.on("answerCall")
def handle_answer_call(data):
    emit("callAccepted", data["signal"], room=data["to"])

if __name__ == "__main__":
    socketio.run(app, port=5000,allow_unsafe_werkzeug=True,host='0.0.0.0')
    print("running")
