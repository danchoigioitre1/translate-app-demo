<!-- <template>
    <div>
      <h2 class="text-xl font-bold">WebRTC Voice Call</h2>
      <audio ref="localAudio" autoplay playsinline muted></audio>
      <audio ref="remoteAudio" autoplay playsinline></audio>
      <div class="mt-4">
        <button @click="startCall" class="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Bắt đầu cuộc gọi</button>
        <button @click="hangupCall" class="px-4 py-2 bg-red-500 text-white rounded">Cúp máy</button>
      </div>
      <div class="visualizer" :class="{ active: isSpeaking }"></div>
    </div>
</template>
  
<script setup>
import { ref, onUnmounted } from 'vue';

const localAudio = ref(null);
const remoteAudio = ref(null);
const localStream = ref(null);
const peerConnection = ref(null);
let socket = null;
const isSpeaking = ref(false);

const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

function initWebSocket() {
    socket = new WebSocket('ws://localhost:9901/rtc-signaling');
    socket.onopen = () => console.log("WebSocket connected.");
    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'offer') await handleOffer(message);
        else if (message.type === 'answer') await handleAnswer(message);
        else if (message.type === 'candidate' && peerConnection.value) {
            try {
                await peerConnection.value.addIceCandidate(new RTCIceCandidate(message.candidate));
            } catch (err) {
                console.error("Error adding ICE candidate:", err);
            }
        }
    };
}

async function startCall() {
    try {
        localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (localAudio.value) localAudio.value.srcObject = localStream.value;
        setupAudioVisualizer();

        if (peerConnection.value) peerConnection.value.close();
        peerConnection.value = new RTCPeerConnection(rtcConfig);

        localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value));

        peerConnection.value.onicecandidate = (event) => {
            if (event.candidate && socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
            }
        };

        peerConnection.value.ontrack = (event) => {
            if (remoteAudio.value && event.streams[0]) {
                remoteAudio.value.srcObject = event.streams[0];
            }
        };

        const offer = await peerConnection.value.createOffer();
        await peerConnection.value.setLocalDescription(offer);
        socket?.send(JSON.stringify({ type: 'offer', sdp: offer.sdp }));
    } catch (error) {
        console.error("Error starting call:", error);
    }
}

async function handleOffer(message) {
    try {
        if (peerConnection.value) peerConnection.value.close();
        peerConnection.value = new RTCPeerConnection(rtcConfig);

        peerConnection.value.onicecandidate = (event) => {
            if (event.candidate && socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
            }
        };

        peerConnection.value.ontrack = (event) => {
            if (remoteAudio.value && event.streams[0]) {
                remoteAudio.value.srcObject = event.streams[0];
            }
        };

        await peerConnection.value.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: message.sdp }));

        if (!localStream.value) {
            localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (localAudio.value) localAudio.value.srcObject = localStream.value;
            setupAudioVisualizer();
        }
        localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value));

        const answer = await peerConnection.value.createAnswer();
        await peerConnection.value.setLocalDescription(answer);
        socket?.send(JSON.stringify({ type: 'answer', sdp: answer.sdp }));
    } catch (error) {
        console.error("Error handling offer:", error);
    }
}

async function handleAnswer(message) {
    try {
        await peerConnection.value.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: message.sdp }));
    } catch (error) {
        console.error("Error handling answer:", error);
    }
}

function hangupCall() {
    if (peerConnection.value) peerConnection.value.close();
    peerConnection.value = null;
    if (localStream.value) {
        localStream.value.getTracks().forEach(track => track.stop());
    }
    isSpeaking.value = false;
}

function setupAudioVisualizer() {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(localStream.value);
    source.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    function checkSpeaking() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        isSpeaking.value = volume > 10;
        requestAnimationFrame(checkSpeaking);
    }
    checkSpeaking();
}

onUnmounted(() => socket?.close());
initWebSocket();
</script>

<style scoped>
button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
}
.visualizer {
    width: 100px;
    height: 10px;
    background: gray;
    transition: background 0.2s;
}
.visualizer.active {
    background: green;
}
</style> -->

<template>
    <div>
      <h2 class="text-xl font-bold">WebRTC Voice Call</h2>
  
      <div class="user-container">
        <!-- Icon User Local -->
        <div>
            clientA: <van-icon name="user" :style="{ color: isSpeakingLocal ? 'green' : 'black' }" size="30"/>
        </div>
        <audio ref="localAudio" autoplay playsinline muted></audio>
  
        <audio ref="remoteAudio" autoplay playsinline></audio>
        <!-- Icon User Remote -->
        <div>
            clientB: <van-icon name="user" :style="{ color: isSpeakingRemote ? 'green' : 'black' }"  size="30"/>
        </div>
      </div>
  
      <div class="mt-4">
        <button @click="startCall" class="">Bắt đầu cuộc gọi</button>
        <button @click="hangupCall" class="">Cúp máy</button>
      </div>
    </div>
  </template>
<script setup>
import { ref, onUnmounted } from 'vue';

const localAudio = ref(null);
const remoteAudio = ref(null);
const localStream = ref(null);
const peerConnection = ref(null);
let socket = null;
const isSpeakingLocal = ref(false);
const isSpeakingRemote = ref(false);

const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

function initWebSocket() {
    socket = new WebSocket('ws://localhost:9901/rtc-signaling');
    socket.onopen = () => console.log("WebSocket connected.");
    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'offer') await handleOffer(message);
        else if (message.type === 'answer') await handleAnswer(message);
        else if (message.type === 'candidate' && peerConnection.value) {
            try {
                await peerConnection.value.addIceCandidate(new RTCIceCandidate(message.candidate));
            } catch (err) {
                console.error("Error adding ICE candidate:", err);
            }
        }
    };
}

async function startCall() {
    try {
        localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (localAudio.value) localAudio.value.srcObject = localStream.value;
        setupAudioVisualizer(localStream.value, isSpeakingLocal);

        if (peerConnection.value) peerConnection.value.close();
        peerConnection.value = new RTCPeerConnection(rtcConfig);

        localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value));

        peerConnection.value.onicecandidate = (event) => {
            if (event.candidate && socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
            }
        };

        peerConnection.value.ontrack = (event) => {
            if (remoteAudio.value && event.streams[0]) {
                remoteAudio.value.srcObject = event.streams[0];
                setupAudioVisualizer(event.streams[0], isSpeakingRemote);
            }
        };

        const offer = await peerConnection.value.createOffer();
        await peerConnection.value.setLocalDescription(offer);
        socket?.send(JSON.stringify({ type: 'offer', sdp: offer.sdp }));
    } catch (error) {
        console.error("Error starting call:", error);
    }
}

async function handleOffer(message) {
    try {
        if (peerConnection.value) peerConnection.value.close();
        peerConnection.value = new RTCPeerConnection(rtcConfig);

        peerConnection.value.onicecandidate = (event) => {
            if (event.candidate && socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
            }
        };

        peerConnection.value.ontrack = (event) => {
            if (remoteAudio.value && event.streams[0]) {
                remoteAudio.value.srcObject = event.streams[0];
                setupAudioVisualizer(event.streams[0], isSpeakingRemote);
            }
        };

        await peerConnection.value.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: message.sdp }));

        if (!localStream.value) {
            localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (localAudio.value) localAudio.value.srcObject = localStream.value;
            setupAudioVisualizer(localStream.value, isSpeakingLocal);
        }
        localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value));

        const answer = await peerConnection.value.createAnswer();
        await peerConnection.value.setLocalDescription(answer);
        socket?.send(JSON.stringify({ type: 'answer', sdp: answer.sdp }));
    } catch (error) {
        console.error("Error handling offer:", error);
    }
}

async function handleAnswer(message) {
    try {
        await peerConnection.value.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: message.sdp }));
    } catch (error) {
        console.error("Error handling answer:", error);
    }
}

function hangupCall() {
    if (peerConnection.value) peerConnection.value.close();
    peerConnection.value = null;
    if (localStream.value) {
        localStream.value.getTracks().forEach(track => track.stop());
    }
    isSpeakingLocal.value = false;
    isSpeakingRemote.value = false;
}

function setupAudioVisualizer(stream, speakingRef) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function checkSpeaking() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        speakingRef.value = volume > 10;
        requestAnimationFrame(checkSpeaking);
    }
    checkSpeaking();
}

onUnmounted(() => socket?.close());
initWebSocket();
</script>
<style scoped>
.user-container{
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
}
</style>
