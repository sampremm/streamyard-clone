# StreamYard Clone

A real-time video streaming application built with React, Node.js, and WebRTC that allows users to stream directly to YouTube via RTMP.

## Features

- Live video streaming to YouTube
- Real-time video/audio capture
- RTMP streaming support
- Low-latency video transmission
- Custom stream controls (start/stop)
- Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React + Vite
- Socket.IO Client
- WebRTC APIs
- Tailwind CSS

### Backend
- Node.js + Express
- Socket.IO Server
- FFmpeg for video processing
- Docker support

## Prerequisites

- Node.js (v16 or higher)
- FFmpeg installed on your system
- YouTube RTMP Stream Key
- Docker (optional)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will run on port 3000.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Usage

1. Start both frontend and backend servers
2. Get your YouTube RTMP stream key from YouTube Studio
3. Open the application in your browser
4. Enter your RTMP URL in the input field
5. Click "Go Live" to start streaming
6. Use the control buttons to manage your stream

## Project Structure

```
streamyard-clone/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── VideoStreamer.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── backend/
    ├── index.js
    ├── Dockerfile
    ├── docker-compose.yml
    └── package.json
```

## API and WebSocket Events

### Socket.IO Events

- `start-stream`: Initiates streaming with RTMP URL
- `stop-stream`: Stops the current stream
- `video-chunk`: Sends video data chunks
- `stream-started`: Confirms stream start
- `stream-stopped`: Confirms stream end
- `error`: Broadcasts error messages

## Environment Variables

### Backend
- `PORT`: Server port (default: 3000)

### Frontend
- `VITE_BACKEND_URL`: Backend server URL (default: http://localhost:3000)

## Docker Support

Build and run using Docker:

```bash
cd backend
docker-compose up --build
```

## Development

### Running in Development Mode

1. Backend:
```bash
cd backend
npm run dev
```

2. Frontend:
```bash
cd frontend
npm run dev
```

## Troubleshooting

1. Ensure FFmpeg is installed and accessible in your PATH
2. Check if ports 3000 (backend) and 5173 (frontend) are available
3. Verify your YouTube stream key is valid
4. Ensure your camera and microphone permissions are enabled

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
