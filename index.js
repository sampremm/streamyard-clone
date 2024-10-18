import http from 'http';
import path from 'path';
import express from 'express';
import { spawn } from 'child_process';


const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2/`,
];

const ffmpegprocess=spawn('ffmpeg',options);

ffmpegprocess.stdout.on('data', (data)=>{
    console.log(`ffmpeg stdout: ${data}`);
})

ffmpegprocess.stderr.on('data', (data)=>{
    console.error(`ffmpeg stdout: ${data}`);
})

ffmpegprocess.on('close', (code)=>{
    console.log(`ffmpeg process exited with code: ${code}`);
})

import{ Server as SocketIO } from 'socket.io'; 

import { log } from 'console';

const app=express();

const server=http.createServer(app);

const io= new SocketIO(server); 
 app.use(express.static(path.resolve('./public')));


io.on('connection',(socket)=>{
    console.log('socket connected', socket.id);
    socket.on("binarystream", (data)=>{
        console.log("binary is incoming");
        ffmpegprocess.stdin.write(data, (err)=>{
            console.log("error",err);
        });
    } )
}); 

server.listen(3000,()=>{
    console.log('http server is running on port 3000');
})