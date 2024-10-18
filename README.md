# StreamYard Clone

A browser-based streaming platform that enables users to record content and stream live to platforms like Facebook, YouTube, and other destinations. The project uses WebRTC for peer-to-peer communication, MediaRecorder API for in-browser recording, and an RTMP server with FFmpeg for video processing and streaming.

## Features

- 🎥 **Recording Studio**: Record audio and video directly in the browser.
- 📡 **Live Streaming**: Stream live to multiple platforms such as Facebook, YouTube, and others.
- 🔄 **Point-to-Point Streaming**: Enable direct peer-to-peer streaming with low latency using WebRTC.
- ⚡ **Real-Time Communication**: Powered by Socket.IO for seamless real-time data exchange.
- 📁 **Cloud Integration**: Option to upload recorded content to cloud storage.
- 🛠️ **FFmpeg Integration**: Video processing and transcoding managed through FFmpeg in the RTMP server.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Streaming**: WebRTC, Nginx RTMP Server, MediaRecorder API, FFmpeg (in Docker)
- **Real-Time Communication**: Socket.IO
- **Containerization**: Docker

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- **Docker**: Make sure Docker is installed on your system.
- **Node.js**: Install Node.js and npm.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/streemyard-clone.git
    cd streemyard-clone
    ```

2. Build and run the Docker containers:
    ```bash
    sudo docker compose up
    ```

3. Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## Usage

1. Open the recording studio to start capturing audio and video.
2. Choose whether to record the content locally or stream live to a supported platform.
3. Configure streaming destinations such as Facebook or YouTube.
4. For point-to-point streaming, connect with another user using WebRTC.



## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any feature requests or bug fixes.


## Acknowledgements

- [WebRTC](https://webrtc.org/) - Real-time communication library
- [Socket.IO](https://socket.io/) - Real-time communication for web applications
- [FFmpeg](https://ffmpeg.org/) - Video processing tool
- [Nginx](https://nginx.org/) - Web and RTMP server
- [Docker](https://www.docker.com/) - Containerization platform
