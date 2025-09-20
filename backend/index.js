import http from 'http';
import path from 'path';
import express from 'express';
import { spawn } from 'child_process';
import { Server as SocketIO } from 'socket.io';
import { error } from 'console';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

app.use(express.static(path.resolve('./public')));


const options = [
    '-i', 'pipe:0',                    // changed from '-' to 'pipe:0'
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', '25',
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'flv',
    'rtmp://a.rtmp.youtube.com/live2/hugy-hcz8-afq0-c1zx-8tv2',
];


let ffmpegProcess = spawn('ffmpeg', options);

ffmpegProcess.stdout.on('data', (data) => {
    console.log(`FFmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
});

ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code: ${code}`);
    ffmpegProcess = null;
});


io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("binarystream", (data) => {
        console.log("Binary stream is incoming");

        
        if (!Buffer.isBuffer(data)) {
            console.error("Received non-binary data");
            return;
        }


        if (ffmpegProcess) {
            ffmpegProcess.stdin.write(data, (err) => {
                if (err) {
                    console.error("Error writing to FFmpeg:", err);
                }
            });
        } else {
            console.error("FFmpeg process is not running", ErrorEvent);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});


const shutdown = () => {
    console.log('Shutting down server...');


    if (ffmpegProcess) {
        ffmpegProcess.stdin.end();
        ffmpegProcess.kill('SIGINT');
    }


    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);


server.listen(3000, () => {
    console.log('HTTP server is running on port 3000');
});
