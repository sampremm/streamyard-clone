const uservideo=document.getElementById('user-video'); 
const startbtn=document.getElementById('start-btn');

const state={ media:null};

const socket=io();

startbtn.addEventListener('click',async(e)=>{
    const mediarecoder=new MediaRecorder(state.media,{
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        mimeType: 'video/webm',
        frameRate: 30
    });
    mediarecoder.ondataavailable=(e)=>{
        console.log("binary stream is available",e.data);
        socket.emit('binarystream',e.data);
    }

    mediarecoder.start(25);
})


window.addEventListener('load', async(e)=>{
    const media= await navigator.mediaDevices.getUserMedia({
        audio:true, 
        video:true
        
    })
    state.media=media;
    uservideo.srcObject=media;
})