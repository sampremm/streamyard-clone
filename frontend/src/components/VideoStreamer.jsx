import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { FaPlay, FaStop, FaVideo, FaRecordVinyl } from 'react-icons/fa';

const VideoStreamer = () => {
  const userVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [rtmpUrl, setRtmpUrl] = useState('');

  useEffect(() => {
    // connect to backend
    socketRef.current = io('http://localhost:3000', { transports: ['websocket'] });

    socketRef.current.on('connect', () =>
      console.log('Socket connected', socketRef.current.id)
    );
    socketRef.current.on('disconnect', () => console.log('Socket disconnected'));

    // get camera + mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      })
      .catch((err) => console.error('Error getting media:', err));

    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const startLive = () => {
    if (!rtmpUrl) {
      alert('Please enter RTMP URL first!');
      return;
    }

    // optionally send rtmpUrl to backend
    socketRef.current.emit('send_link', rtmpUrl);

    const stream = userVideoRef.current.srcObject;

    socketRef.current.emit('start-stream', { rtmpUrl });

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus'
    });

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        e.data.arrayBuffer().then((buffer) => {
          socketRef.current.emit('binarystream', buffer);
        });
        if (isRecording) setRecordedChunks((prev) => [...prev, e.data]);
      }
    };

    mediaRecorderRef.current.start(250); // send every 250ms
    setIsLive(true);
  };

  const stopLive = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    socketRef.current.emit('stop-stream');
    setIsLive(false);
  };

  const startRecording = () => {
    setRecordedChunks([]);
    setIsRecording(true);
    if (!isLive) startLive();
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    // save locally
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording_${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">StreamYard Clone</h1>

      {/* RTMP URL input */}
      <input
        type="text"
        placeholder="Enter RTMP URL"
        value={rtmpUrl}
        onChange={(e) => setRtmpUrl(e.target.value)}
        className="w-full max-w-3xl mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Local video preview */}
      <video
        ref={userVideoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-3xl h-auto rounded-lg border-2 border-gray-300 shadow-md mb-6"
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={startLive}
          disabled={isLive}
          className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white font-semibold rounded-2xl shadow hover:bg-green-600 disabled:bg-gray-400"
        >
          <FaPlay /> {isLive ? 'Streaming…' : 'Start Live'}
        </button>

        <button
          onClick={stopLive}
          disabled={!isLive}
          className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-2xl shadow hover:bg-red-600 disabled:bg-gray-400"
        >
          <FaStop /> Stop Live
        </button>

        <button
          onClick={startRecording}
          disabled={isRecording}
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white font-semibold rounded-2xl shadow hover:bg-blue-600 disabled:bg-gray-400"
        >
          <FaRecordVinyl /> Start Recording
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-2xl shadow hover:bg-yellow-600 disabled:bg-gray-400"
        >
          <FaVideo /> Stop & Save Recording
        </button>
      </div>

      <p className="text-gray-600 text-sm max-w-3xl text-center mb-6">
        Enter your  RTMP URL above to start live streaming. Recording will
        save locally as WebM.
      </p>
    </div>
  );
};

export default VideoStreamer;
