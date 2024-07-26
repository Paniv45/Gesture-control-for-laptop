import React, { useRef, useEffect } from 'react';
import './Webcam.css'; // Ensure this is imported

const Webcam = ({ onReady }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        onReady(videoRef.current);  // Pass the video element to parent component
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    setupCamera();
  }, [onReady]);

  return <video ref={videoRef} className="webcam" autoPlay playsInline />;
};

export default Webcam;
