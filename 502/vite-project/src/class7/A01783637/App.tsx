import { useEffect, useRef, useState } from 'react';

function App() {
  const socketRef = useRef<WebSocket | null>(null);
  const [input, setInput] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  const [received, setReceived] = useState<string[]>([]);

  useEffect(() => {
    // Pick the right protocol/host and path
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${proto}://${window.location.host}/ws/`;

    const connect = () => {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => console.log('✅ WebSocket connected');

      ws.onmessage = event =>
        setReceived(prev => [...prev, event.data as string]);

      ws.onerror = event => console.error('❌ WebSocket error', event);

      ws.onclose = event => {
        console.log('🔌 WebSocket closed', event.code);
        socketRef.current = null;

        // Auto-reconnect (5 s timeout), ignore if component unmounted
        if (!event.wasClean) {
          setTimeout(() => socketRef.current || connect(), 5_000);
        }
      };
    };

    connect();
    return () => socketRef.current?.close();
  }, []);

  const send = () => {
    const ws = socketRef.current;
    if (ws?.readyState === WebSocket.OPEN && input.trim()) {
      ws.send(input);
      setSent(prev => [...prev, input]);
      setInput('');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">🛰️ React + WebSocket Chat</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Sent Messages */}
        <MessagePanel title="You" color="blue" messages={sent} />

        {/* Received Messages */}
        <MessagePanel title="Server" color="gray" messages={received} />
      </div>

      <div className="flex space-x-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/** Re-usable panel component */
function MessagePanel({
  title,
  color,
  messages,
}: {
  title: string;
  color: 'blue' | 'gray';
  messages: string[];
}) {
  const bg = color === 'blue' ? 'bg-blue-50' : 'bg-gray-100';
  const text = color === 'blue' ? 'text-blue-900' : 'text-gray-800';

  return (
    <div>
      <h2 className={`text-lg font-semibold mb-2 text-${color}-700`}>{title}</h2>
      <div className={`border rounded ${bg} p-4 h-64 overflow-y-auto`}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-1 ${text} text-sm`}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
