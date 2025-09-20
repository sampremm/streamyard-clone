import React from "react";
import VideoStreamer from "./components/VideoStreamer";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6">
        <VideoStreamer />
      </div>
    </div>
  );
}

export default App;
