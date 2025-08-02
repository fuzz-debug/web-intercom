let mediaRecorder;
let socket;

document.getElementById("talkBtn").addEventListener("click", async () => {
  const btn = document.getElementById("talkBtn");
  const status = document.getElementById("status");
  const url = document.getElementById("serverUrl").value;

  if (!url) {
    alert("Please enter WebSocket server URL");
    return;
  }

  socket = new WebSocket(url);

  socket.onopen = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(e.data);
        }
      };

      mediaRecorder.start(100);
      status.textContent = "Status: Streaming...";
      btn.textContent = "Talking...";
      btn.disabled = true;
    } catch (err) {
      status.textContent = "Status: Mic access denied";
    }
  };

  socket.onerror = () => {
    status.textContent = "Status: WebSocket error";
  };
});
