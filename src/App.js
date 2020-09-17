import React, { useState, useEffect } from "react";
import "./App.css";
import { db, storage, timestamp } from "./firebase";
import CircularProgress from "@material-ui/core/CircularProgress";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [attach, setAttach] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState("");
  useEffect(() => {
    setName(prompt("Enter your name"));
    return () => {
      setName("");
    };
  }, []);

  useEffect(() => {
    db.collection("chats")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setMessages(
          snapShot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            message: doc.data().message,
            type: doc.data().type,
          }))
        );
      });
  }, []);
  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim() !== "" && !attach) {
      db.collection("chats")
        .add({
          name: name,
          message: message,
          type: "text",
          timestamp: timestamp,
        })
        .then(() => {});
      setMessage("");
    } else if (attach) {
      sendAttach();
    } else {
      alert("Enter some message");
    }
  };

  const handleAttachment = (event) => {
    if (event.target.files[0]) {
      setAttach(event.target.files[0]);
    }
  };

  const sendAttach = () => {
    const extension = attach.name.split(".").pop();
    let imageName = Date.now() + "." + extension;
    const uploadTask = storage.ref(`attachments/${imageName}`).put(attach);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadPercentage(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref("attachments")
          .child(imageName)
          .getDownloadURL()
          .then((url) => {
            db.collection("chats")
              .add({
                name: name,
                message: url,
                type: "attach",
                timestamp: timestamp,
              })
              .then(() => {
                setUploadPercentage("");
                setAttach(null);
              });
          });
      }
    );
  };
  return (
    <div className="app">
      <div className="app__container">
        <h1 className="app__title">NEC Chat Room</h1>
        <h3 className="app__user">Welcome {name}</h3>
        <div className="app__messageContainer">
          <div className="app__messages">
            {messages.map((message) =>
              message.type === "text" ? (
                <p key={message.id}>
                  <span className="app__userName">{message.name}</span> :{" "}
                  {message.message}
                </p>
              ) : (
                <p key={message.id}>
                  <span className="app__userName">{message.name}</span> :{" "}
                  <a
                    href={message.message}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Now
                  </a>
                </p>
              )
            )}
          </div>
          <form>
            <input
              placeholder="Enter a message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="app__inputMessage"
            />
            <button
              onClick={sendMessage}
              type="submit"
              className="app__sendButton"
            >
              Send
            </button>
            <br />
            <input type="file" onChange={handleAttachment} />
          </form>

          {uploadPercentage > 0 && (
            <CircularProgress variant="static" value={uploadPercentage} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
