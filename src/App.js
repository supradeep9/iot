import React, { useContext, useState, useEffect, useRef } from "react";

import "./App.css";
import Audio from "./Audio";

function App() {
  const [song, setSong] = useState([]);
  const [songName, setSongName] = useState(0);
  const [local, setLocal] = useState(-1);

  useEffect(() => {
    setLocal(localStorage.getItem("musicName"));
    const request = indexedDB.open("MyDatabase", 4);
    request.onerror = (event) => {
      console.log("something wrong", event.target.error);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("Data", {
        autoIncrement: true,
      });
      objectStore.createIndex("names", "names", { unique: true });
      objectStore.createIndex("audio", "audio", { unique: true });
      objectStore.createIndex("sizes", "sizees", { unique: true });
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("Data", "readonly");
      const objectStore = transaction.objectStore("Data");
      const getAllRequest = objectStore.getAll();
      getAllRequest.onsuccess = () => {
        console.log(getAllRequest.result);
        setSong(getAllRequest.result);
      };
      getAllRequest.onerror = (event) => {
        console.log("error");
      };
    };
  }, []);
  console.log(song);

  function fileAdded(e) {
    const files = e.target.files[0];
    const songName = files.name;
    console.log(files);

    if (files) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const audioData = e.target.result;
        saveAudioData(audioData, files.name, files.size);
      };
      reader.readAsArrayBuffer(files);
    }
  }

  function saveAudioData(audioData, name, size) {
    const request = indexedDB.open("MyDatabase", 4);

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(["Data"], "readwrite");
      const objectStore = transaction.objectStore("Data");

      const addRequest = objectStore.add({
        audio: audioData,
        names: name,
        sizes: size,
      });

      addRequest.onsuccess = () => {
        console.log("Data added successfully");
        // Refresh data in the component
        const getAllRequest = objectStore.getAll();
        getAllRequest.onsuccess = () => {
          console.log(getAllRequest.result.audio);
          setSong(getAllRequest.result);
        };
      };

      addRequest.onerror = (error) => {
        console.error("Error adding data:", error.target.error);
      };
    };
  }

  function buttonClicked(item) {
    setSongName(item);
    localStorage.setItem("musicName", item.names);
  }

  console.log(song);
  return (
    <div
      className=" parent"
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div className="first">
        <h1 style={{ fontSize: "18px" }}>Add Songs to your PlayList </h1>
        <input
          type="file"
          accept="audio/*"
          onChange={fileAdded}
          style={{ marginLeft: "100px" }}
        />
      </div>
      {song[0]?.audio ? (
        <Audio
          className="second"
          value={song}
          value1={songName}
          nextSongs={setSongName}
          key={song}
        />
      ) : (
        <h1>Your Playlist is Empty</h1>
      )}
      <div className="three">
        {song[0]?.audio ? (
          <h1 style={{ fontSize: "28px" }}>Your PlayList</h1>
        ) : (
          ""
        )}
        {song.map((item) => {
          return (
            <div>
              <p
                style={{
                  fontSize: "20px",
                  display: "inline-block",
                  marginRight: "10px",
                }}
              >
                {item.names}
              </p>

              <button
                onClick={() => buttonClicked(item)}
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  backgroundColor: " #FFF7F1",
                }}
              >
                Play
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
