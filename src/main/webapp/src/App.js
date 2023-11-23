import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet"
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';


function App() {
  const [stompClient, setStompClient] = useState(null);
   const [codeEditorValue, setCodeEditorValue] = useState('');

  useEffect(() => {
    const connect = () => {
      const socket = new SockJS('/realtime');
      const client = Stomp.over(socket);
      client.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        client.subscribe('/topic/updates', (update) => {
          setCodeEditorValue(update.body);
        });
      });
      setStompClient(client);
    };

    const sendEdit = () => {
      const text = codeEditorValue;
      stompClient.send('/app/editCode', {}, text);
    };

    const codeEditorInputHandler = (event) => {
      setCodeEditorValue(event.target.value);
    };

    const setCodeEditorValue = (value) => {
      // Implement any necessary logic when setting the code editor value
      document.getElementById('codeEditor').value = value;
    };

    document.getElementById('codeEditor').addEventListener('input', sendEdit);

    connect();

    // Cleanup event listener on component unmount
    return () => {
      document.getElementById('codeEditor').removeEventListener('input', sendEdit);
    };
  }, [stompClient]);
  return (
    <div className="App">
        <Helmet>
            <title>Real-Time Editing</title>
                <script src="https://cdn.jsdelivr.net/npm/sockjs-client/dist/sockjs.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/stomp-websocket/lib/stomp.min.js"></script>
        </Helmet>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <h2>Real-Time Code Editor</h2>
      <textarea id="codeEditor" rows="10" cols="30"></textarea>

    </div>
  );
}

export default App;
