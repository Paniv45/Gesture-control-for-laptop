import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs';
import gestureToAction from '../utils/gestureMapping';

const GestureRecognition = ({ video }) => {
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [lastActionTime, setLastActionTime] = useState(0); // State to track last action time
  const debounceDelay = 5000; // 5 seconds debounce delay

  // Constants for scroll detection
  const SCROLL_UP_THRESHOLD = 0.2; // 10% of the canvas height
  const SCROLL_DOWN_THRESHOLD = 0.8; // 90% of the canvas height

  useEffect(() => {
    const loadModel = async () => {
      try {
        const handModel = await handpose.load();
        setModel(handModel);
        console.log('Handpose model loaded');
      } catch (error) {
        console.error('Error loading handpose model:', error);
      }
    };

    loadModel();
  }, []);

  const recognizeGesture = (predictions) => {
    if (predictions.length === 0) return 'UNKNOWN';

    const hand = predictions[0];
    const landmarks = hand.landmarks;

    if (!landmarks || landmarks.length < 21) return 'UNKNOWN';

    const isFingerExtended = (fingerBaseIndex, fingerTipIndex) => {
      return landmarks[fingerTipIndex][1] < landmarks[fingerBaseIndex][1];
    };

    const extendedFingers = [
      isFingerExtended(0, 4),
      isFingerExtended(5, 8),
      isFingerExtended(9, 12),
      isFingerExtended(13, 16),
      isFingerExtended(17, 20),
    ].filter((extended) => extended).length;

    return extendedFingers === 0
      ? 'UNKNOWN'
      : extendedFingers === 1
      ? '1'
      : extendedFingers === 2
      ? '2'
      : extendedFingers === 3
      ? '3'
      : extendedFingers === 4
      ? '4'
      : extendedFingers === 5
      ? '5'
      : 'UNKNOWN';
  };

  const determineGesture = useCallback(
    (predictions) => {
      if (predictions.length > 0) {
        const gesture = recognizeGesture(predictions);
        const handPosition = predictions[0].boundingBox.topLeft[1]; // Example position

        // Map hand position to action
        let action;
        if (handPosition < SCROLL_UP_THRESHOLD * canvasRef.current.height) {
          action = 'SCROLL_UP';
        } else if (handPosition > SCROLL_DOWN_THRESHOLD * canvasRef.current.height) {
          action = 'SCROLL_DOWN';
        } else {
          action = gestureToAction(gesture);
        }

        console.log('Detected gesture:', gesture, 'Action:', action);

        const currentTime = Date.now();

        // Check if enough time has passed since the last action
        if (currentTime - lastActionTime > debounceDelay) {
          if (action) {
            handleAction(action, handPosition); // Pass hand position for scroll logic
            setLastActionTime(currentTime); // Update last action time
          }
        }
      }
    },
    [lastActionTime] // Dependency on lastActionTime
  );

  const handleAction = async (action, handPosition) => {
    try {
      const response = await fetch('http://localhost:3000/api/gesture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, handPosition }), // Send hand position
      });

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error sending action to backend:', error);
    }
  };

  useEffect(() => {
    const detectGestures = async () => {
      if (model && video) {
        const predictions = await model.estimateHands(video);
        console.log('Predictions:', predictions);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw red lines for scroll detection
        const scrollUpLineY = SCROLL_UP_THRESHOLD * canvas.height;
        const scrollDownLineY = SCROLL_DOWN_THRESHOLD * canvas.height;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        // Center the scroll lines
        ctx.beginPath();
        ctx.moveTo(0, scrollUpLineY);
        ctx.lineTo(canvas.width, scrollUpLineY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, scrollDownLineY);
        ctx.lineTo(canvas.width, scrollDownLineY);
        ctx.stroke();

        predictions.forEach((prediction) => {
          prediction.landmarks.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
          });
        });

        determineGesture(predictions);

        requestAnimationFrame(detectGestures);
      }
    };

    if (model) {
      detectGestures();
    }
  }, [model, determineGesture, video]);

  return <canvas ref={canvasRef} className="canvas" width="640" height="480" />;
};

export default GestureRecognition;
