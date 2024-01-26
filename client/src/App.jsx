import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.scss";

const socket = io.connect("http://localhost:5000");
function App() {
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [stream, setStream] = useState();
  const [myId, setMyId] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [name, setName] = useState();
  const [from, setFrom] = useState();
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [me, setMe] = useState();
  const [caller, setCaller] = useState();
  const [idToCall, setIdToCall] = useState();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });
    socket.on("me", (id) => {
      setMyId(id);
    });
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };
  return (
    <div className="App">
      <h1>hello</h1>
      {stream && (
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          style={{ width: "40vw", height: "40vh" }}
        />
      )}
      <input
        placeholder="Enter id to call"
        onChange={(e) => {
          setIdToCall(e.target.value);
        }}
      ></input>
    </div>
  );
}

export default App;
