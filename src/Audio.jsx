import React, { useEffect, useState, useRef } from "react";

const Audio = ({ value, value1, nextSongs }) => {
  let nextArr = -1;

  let localValue;
  let local;

  function music() {
    if (value1 == 0) {
      local = localStorage.getItem("musicName");
      localValue = value.filter((item) => item.names === local);

      const blob = new Blob([localValue[0]?.audio], {
        type: "audio/mp3",
      });
      const result = URL.createObjectURL(blob);
      console.log(result);
      return result;
    } else {
      const blob = new Blob([value1?.audio], {
        type: "audio/mp3",
      });
      const result = URL.createObjectURL(blob);

      return result;
    }
  }

  function nextSong() {
    let present = value1?.names || local;
    nextArr = value.findIndex((item) => item.names === present);
    if (nextArr == value.length - 1) {
      nextArr = 0;
    } else {
      nextArr++;
    }

    nextSongs(value[nextArr]);
    localStorage.setItem("musicName", value[nextArr].names);
  }

  function time1(e) {
    let audio = document.getElementById("audio");
    audio.currentTime = localStorage.getItem("presentTime") || 0;
    localStorage.setItem("presentTime", 0);
  }

  window.addEventListener("beforeunload", () => {
    let audio = document.getElementById("audio");
    localStorage.setItem("presentTime", audio.currentTime);
  });
  return (
    <div>
      <audio
        id="audio"
        controls
        accept="audio/*"
        key={value1 ? value1.names : localValue[0]?.audio}
        autoPlay="true"
        onLoadedData={time1}
        onEnded={() => nextSong()}
      >
        <source src={music()} />
      </audio>
      <p> Now Playing {value1?.names || localValue[0].names}</p>
    </div>
  );
};

export default Audio;
