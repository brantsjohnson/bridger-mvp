import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera } from 'lucide-react';
import { handleFriendConnection } from '../lib/friendConnections';

const CameraScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    console.log('=== STARTING QR SCANNER CAMERA ===');
    setError(null);
    setLoading(true);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not supported');
      setLoading(false);
      return;
    }

    try {
      // Check if we already have camera permission
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission status:', permissions.state);
      
      if (permissions.state === 'denied') {
        throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
      }
      
      // Get available video devices to find rear-facing camera
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices);
      
      // Find rear-facing camera (usually has 'environment' or 'back' in the label)
      const rearCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('environment') ||
        device.label.toLowerCase().includes('rear')
      );
      
      const constraints = {
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'environment', // Use rear camera for QR scanning
          // If we found a specific rear camera, use its deviceId
          ...(rearCamera && { deviceId: { exact: rearCamera.deviceId } })
        },
        audio: false
      };
      
      console.log('Camera constraints:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', stream);
      
      // Force the video element to be ready first
      setIsStreaming(true);
      
      // Wait a bit for the video element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (videoRef.current) {
        console.log('Setting video srcObject...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Set up all event listeners
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          setLoading(false);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
        };
        
        videoRef.current.onplay = () => {
          console.log('Video is playing');
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video error:', e);
          setLoading(false);
        };
        
        // Force play the video
        try {
          await videoRef.current.play();
          console.log('Video play successful');
          
          // Start QR code scanning
          setScanning(true);
          startQRScanning();
        } catch (playError) {
          console.error('Video play failed:', playError);
        }
      } else {
        console.error('Video element not found after setting streaming to true');
        stream.getTracks().forEach(track => track.stop());
        setIsStreaming(false);
        setLoading(false);
        throw new Error('Video element not available');
      }
      
    } catch (err) {
      console.error('Camera error:', err);
      setLoading(false);
      setIsStreaming(false);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else if (err.name === 'NotSupportedError') {
          setError('Camera not supported in this browser.');
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('Camera access denied or not available');
      }
    }
  }, []);

  const startQRScanning = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const scanFrame = () => {
      if (!videoRef.current || !canvasRef.current || !scanning) return;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Set canvas size to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Get image data for QR code detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple QR code detection (this would use a proper QR library in production)
      // For now, we'll simulate QR detection
      const qrData = detectQRCode(imageData);
      
      if (qrData) {
        console.log('QR Code detected:', qrData);
        setScanResult(qrData);
        setScanning(false);
        
        // Handle the QR code data
        handleQRCodeData(qrData);
      } else {
        // Continue scanning
        requestAnimationFrame(scanFrame);
      }
    };
    
    scanFrame();
  }, [scanning]);
  
  const detectQRCode = (imageData: ImageData): string | null => {
    // This is a placeholder - in production you'd use a QR code library
    // For now, we'll simulate QR detection
    return null;
  };
  
  const handleQRCodeData = async (qrData: string) => {
    try {
      // Parse QR code data
      const connectionData = JSON.parse(qrData);
      
      // Get current user
      const storedUserData = localStorage.getItem('bridger_user_data');
      if (!storedUserData) {
        console.error('No user data found');
        return;
      }
      
      const user = JSON.parse(storedUserData);
      
      // Handle the friend connection
      const result = await handleFriendConnection(user.id, connectionData);
      
      if (result.success) {
        console.log('✅ Friend connection successful:', result.friend);
        // You could show a success message or navigate to friends list
      } else {
        console.error('❌ Friend connection failed:', result.error);
      }
    } catch (error) {
      console.error('Error handling QR code data:', error);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setLoading(false);
    setScanning(false);
  }, []);

  useEffect(() => {
    // Auto-start camera if we have permission
    const checkAndStartCamera = async () => {
      try {
        const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (permissions.state === 'granted') {
          console.log('Camera permission already granted, auto-starting...');
          startCamera();
        }
      } catch (error) {
        console.log('No camera permission yet, waiting for user to click start');
      }
    };
    
    checkAndStartCamera();
    
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full border-2 border-gray-600 overflow-hidden bg-black relative" style={{ borderStyle: 'inset' }}>
        {isStreaming ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                backgroundColor: '#000',
                display: 'block',
                width: '100%',
                height: '100%'
              }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ display: 'none' }}
            />
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-blue-500 w-48 h-48 rounded-lg">
                  <div className="text-white text-center text-sm mt-2">Scanning QR Code...</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white bg-black">
            <Camera className="w-8 h-8 mb-2" />
            <span className="text-sm mb-4">
              {loading ? 'Starting Camera...' : 'Camera Ready'}
            </span>
            
            {/* Start Camera Button - centered in the box */}
            {!loading && (
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 text-white text-sm border-2 font-bold pixel-font hover:bg-blue-700"
                style={{ border: '2px outset #e0e0e0' }}
              >
                Start Camera
              </button>
            )}
          </div>
        )}
        

      </div>
      
      {error && (
        <div className="absolute top-2 left-2 right-2 text-red-600 font-mono text-xs p-2 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default CameraScanner;