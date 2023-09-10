const socket = io('http://localhost:3000');
const videoGrid = document.getElementById('video-grid');
const messages = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const ROOM_ID = prompt('Enter Room ID:');

// Create a new Peer connection
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3000',
});

const myVideo = document.createElement('video');
myVideo.muted = true; // Mute our own video

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    // Display our video stream
    addVideoStream(myVideo, stream);

    // Answer a call from another user
    myPeer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // Allow other users to call us
    myPeer.on('open', (id) => {
      socket.emit('join-room', ROOM_ID, id);
    });
  })
  .catch((error) => {
    console.error('Error accessing camera and microphone:', error);
  });

// Handle incoming chat messages
socket.on('chat-message', (message) => {
  appendMessage(message);
});

// Handle sending chat messages
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  // Send the message to the server
  socket.emit('chat-message', ROOM_ID, message);
  appendMessage(`You: ${message}`);
  messageInput.value = '';
});

// Function to add video streams to the video grid
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
    videoGrid.append(video);
  });
}

// Function to append chat messages to the messages div
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messages.append(messageElement);
}

// Function to scroll to the bottom of the chat window
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}
