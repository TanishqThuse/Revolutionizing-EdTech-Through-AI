import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera as CameraIcon, Sparkles, FlipHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraProps {
  onCapture: (image: string) => void;
  isProcessing: boolean;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, isProcessing }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [notification, setNotification] = useState<string>('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Hide after 3 seconds
  };

  const toggleCamera = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        showNotification('No camera found on your device');
        return;
      }

      if (videoDevices.length === 1) {
        showNotification('Only one camera available');
        return;
      }

      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
      showNotification(`Switched to ${facingMode === 'user' ? 'back' : 'front'} camera`);
    } catch (error) {
      console.error('Error accessing camera:', error);
      showNotification('Error accessing camera');
    }
  }, [facingMode]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  if (!isCameraActive) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg 
                   flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        onClick={() => setIsCameraActive(true)}
      >
        <CameraIcon className="w-5 h-5" />
        Start Camera
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-xl"
        videoConstraints={{
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }}
        onUserMediaError={() => {
          showNotification('Error accessing camera');
          setIsCameraActive(false);
        }}
      />
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 
                       bg-black/75 text-white px-4 py-2 rounded-full
                       backdrop-blur-sm text-sm"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCamera}
          className="bg-white/90 backdrop-blur-sm text-purple-600 p-3 rounded-full shadow-lg
                     hover:bg-white transition-colors"
        >
          <FlipHorizontal className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isProcessing}
          onClick={capture}
          className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                    px-6 py-3 rounded-full flex items-center gap-2 shadow-lg
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
        >
          {isProcessing ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CameraIcon className="w-5 h-5" />
              Capture Problem
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};