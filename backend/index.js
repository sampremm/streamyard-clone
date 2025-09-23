// index.js
import http from 'http';
import express from 'express';
import { Server as SocketIO } from 'socket.io';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  maxHttpBufferSize: 1e8 // allow big chunks
});

// Serve frontend (build folder)
app.use(express.static(path.join(process.cwd(), 'public')));

// YouTube RTMP URL (replace with yours)
const YT_RTMP = 'rtmp://a.rtmp.youtube.com/';

let ffmpegProcess = null;

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('start-stream', () => {
    console.log('Starting FFmpeg process…');

    // spawn ffmpeg when stream starts
    ffmpegProcess = spawn('ffmpeg', [
      '-f', 'webm',            // tell FFmpeg input is WebM
      '-i', 'pipe:0',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-tune', 'zerolatency',
      '-r', '25',
      '-g', '50',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ar', '44100',
      '-f', 'flv',
      YT_RTMP
    ]);

    ffmpegProcess.stderr.on('data', (data) => console.error('FFmpeg:', data.toString()));
    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg exited with code ${code}`);
      ffmpegProcess = null;
    });
  });

  socket.on('binarystream', (data) => {
    if (!ffmpegProcess) return;
    try {
      ffmpegProcess.stdin.write(Buffer.from(data));
    } catch (err) {
      console.error('Error writing to FFmpeg stdin:', err);
    }
  });

  socket.on('stop-stream', () => {
    if (ffmpegProcess) {
      ffmpegProcess.stdin.end();
      ffmpegProcess.kill('SIGINT');
      ffmpegProcess = null;
      console.log('Stopped streaming.');
    }
  });

  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

server.listen(3000, () => console.log('HTTP server running on http://localhost:3000'));
