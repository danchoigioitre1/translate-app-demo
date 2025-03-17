<template>
    <div>
      <h2 class="text-xl font-bold">WebRTC Voice/Video Call</h2>
      <video ref="localVideo" autoplay playsinline muted></video>
      <video ref="remoteVideo" autoplay playsinline></video>
      <div class="mt-4">
        <button @click="startCall" class="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Bắt đầu cuộc gọi</button>
        <button @click="hangupCall" class="px-4 py-2 bg-red-500 text-white rounded">Cúp máy</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onUnmounted } from 'vue';
  
  // Khai báo các biến sử dụng
  const localVideo = ref(null);
  const remoteVideo = ref(null);
  const localStream = ref(null);
  const peerConnection = ref(null);
  let socket = null;
  
  // Định nghĩa cấu hình ICE server (ở đây dùng STUN của Google)
  const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  };
  
  function initWebSocket() {
    // Khởi tạo WebSocket và thiết lập các sự kiện
    socket = new WebSocket('ws://localhost:9901/rtc-signaling');
    socket.onopen = () => {
      console.log("WebSocket connected.");
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'offer') {
        await handleOffer(message);
      } else if (message.type === 'answer') {
        await handleAnswer(message);
      } else if (message.type === 'candidate') {
        if (peerConnection.value) {
          try {
            await peerConnection.value.addIceCandidate(new RTCIceCandidate(message.candidate));
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        }
      }
    };
  }
  
  async function startCall() {
    try {
      // Lấy quyền truy cập mic và camera (ở đây lấy cả video và audio; nếu chỉ cần audio thì dùng { audio: true })
      localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideo.value) {
        localVideo.value.srcObject = localStream.value;
      } else {
        console.error("localVideo element not ready");
        return;
      }
  
      // Nếu đã có một kết nối rồi thì cúp cuộc gọi cũ trước khi tạo mới
      if (peerConnection.value) {
        peerConnection.value.close();
      }
      peerConnection.value = new RTCPeerConnection(rtcConfig);
  
      // Thêm các track của stream vào kết nối
      localStream.value.getTracks().forEach(track => {
        peerConnection.value.addTrack(track, localStream.value);
      });
  
      // Xử lý sự kiện ICE candidate
      peerConnection.value.onicecandidate = (event) => {
        if (event.candidate && socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      };
  
      // Khi nhận track từ remote peer
      peerConnection.value.ontrack = (event) => {
        if (remoteVideo.value && event.streams && event.streams[0]) {
          remoteVideo.value.srcObject = event.streams[0];
        }
      };
  
      // Tạo offer và gửi cho peer
      const offer = await peerConnection.value.createOffer();
      await peerConnection.value.setLocalDescription(offer);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'offer', sdp: offer.sdp }));
      }
    } catch (error) {
      console.error("Error starting call:", error);
    }
  }
  
  async function handleOffer(message) {
    try {
      // Nếu đã có peerConnection, đóng nó trước khi tạo mới
      if (peerConnection.value) {
        peerConnection.value.close();
      }
      peerConnection.value = new RTCPeerConnection(rtcConfig);
  
      // Thiết lập onicecandidate
      peerConnection.value.onicecandidate = (event) => {
        if (event.candidate && socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      };
  
      // Thiết lập ontrack để nhận luồng từ remote
      peerConnection.value.ontrack = (event) => {
        if (remoteVideo.value && event.streams && event.streams[0]) {
          remoteVideo.value.srcObject = event.streams[0];
        }
      };
  
      // Đặt remote description từ offer nhận được
      await peerConnection.value.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: message.sdp }));
  
      // Nếu cần, lấy local stream (ở đây chúng ta cũng có thể tái sử dụng localStream đã có nếu call đã được bắt đầu từ phía nhận)
      if (!localStream.value) {
        localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideo.value) {
          localVideo.value.srcObject = localStream.value;
        }
      }
      localStream.value.getTracks().forEach(track => {
        peerConnection.value.addTrack(track, localStream.value);
      });
  
      // Tạo answer và gửi lại
      const answer = await peerConnection.value.createAnswer();
      await peerConnection.value.setLocalDescription(answer);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'answer', sdp: answer.sdp }));
      }
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
    if (peerConnection.value) {
      peerConnection.value.close();
      peerConnection.value = null;
    }
    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop());
    }
  }
  
  // Khép kết nối WebSocket khi component bị hủy
  onUnmounted(() => {
    if (socket) {
      socket.close();
    }
  });
  
  initWebSocket();
  
  </script>
  
  <style scoped>
  button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
  }
  video {
    width: 300px;
    height: auto;
    margin-right: 10px;
    background: #000;
  }
  </style>
  