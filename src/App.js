import React, { useState } from 'react';
import Webcam from './components/Webcam';
import GestureRecognition from './components/GestureRecognition';
import './App.css';

const App = () => {
  const [videoElement, setVideoElement] = useState(null);

  return (
    <div className="App">
      <h1>Gesture Control for Laptop</h1>
      <div className="video-container">
        <Webcam onReady={setVideoElement} />
        {videoElement && <GestureRecognition video={videoElement} />}
      </div>
    </div>
  );
};

export default App;
