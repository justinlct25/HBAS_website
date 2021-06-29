import React, { useEffect } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import socketClient  from "socket.io-client";

const SERVER = "http://127.0.0.1:8080";

function App() {
  useEffect(() => {
    const socket = socketClient(SERVER);
    socket.on('connection', ()=>{
      console.log(`I'm connected with the back-end`);
    });   
  }, [])
  return (
    <div className="App">
    <LandingPage />
    </div>
  );
}

export default App;
