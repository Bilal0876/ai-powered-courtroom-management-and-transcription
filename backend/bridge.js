// pythonBridge.js
const WebSocket = require("ws");

const PYTHON_SERVER = "ws://localhost:8765";
const NODE_SERVER_PORT = 8080;

// Connect to Python transcription server
const pythonWS = new WebSocket(PYTHON_SERVER);

// Create a WebSocket server for React clients
const wss = new WebSocket.Server({ port: NODE_SERVER_PORT });
console.log(`🟢 Node WebSocket bridge running on ws://localhost:${NODE_SERVER_PORT}`);

wss.on("connection", (client) => {
  console.log("🖥️ React client connected");
  client.send(JSON.stringify({ type: "status", message: "Connected to Node bridge" }));

  // Forward messages from Python → React
  pythonWS.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === "transcription" || msg.type === "status") {
        client.send(JSON.stringify(msg));
      }
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  });

  // Forward control messages from React → Python
  client.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (["start_recording", "pause_recording", "resume_recording", "stop_recording"].includes(msg.type)) {
        pythonWS.send(JSON.stringify(msg));
      }
    } catch (err) {
      console.error("Error parsing client message:", err);
    }
  });

  client.on("close", () => console.log("React client disconnected"));
});

