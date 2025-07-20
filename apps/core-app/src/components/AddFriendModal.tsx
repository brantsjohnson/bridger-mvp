import { useState, useRef, useEffect } from 'react';
import { X, UserPlus, Scan, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFriendModal = ({ isOpen, onClose }: AddFriendModalProps) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Function to stop camera completely
  const stopCamera = async () => {
    console.log('=== STOPPING CAMERA ===');
    
    // Method 1: Stop via streamRef
    if (streamRef.current) {
      console.log('Stopping via streamRef');
      const tracks = streamRef.current.getTracks();
      console.log('Found tracks:', tracks.length);
      tracks.forEach((track, index) => {
        console.log(`Track ${index}: kind=${track.kind}, readyState=${track.readyState}, enabled=${track.enabled}`);
        track.enabled = false;
        track.stop();
        console.log(`Track ${index} after stop: readyState=${track.readyState}`);
      });
      streamRef.current = null;
    }
    
    // Method 2: Stop via video element srcObject
    if (videoRef.current?.srcObject) {
      console.log('Stopping via video srcObject');
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track, index) => {
        console.log(`Video track ${index}: kind=${track.kind}, readyState=${track.readyState}`);
        track.enabled = false;
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    
    // Method 3: Clear video element completely
    if (videoRef.current) {
      console.log('Clearing video element');
      videoRef.current.pause();
      videoRef.current.src = '';
      videoRef.current.load();
    }
    
    console.log('=== CAMERA STOP COMPLETE ===');
  };

  useEffect(() => {
    if (isOpen) {
      // Generate user's QR code
      const generateQRCode = async () => {
        try {
          const userQRData = `user-${Date.now()}`; // Simple user ID for demo
          const dataUrl = await QRCode.toDataURL(userQRData, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeDataUrl(dataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      };

      // Start camera for QR scanning
      const startCamera = async () => {
        try {
          console.log('Starting camera...');
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          console.log('Camera started');
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };

      generateQRCode();
      startCamera();
    } else {
      // Clean up camera stream when modal closes
      stopCamera();
    }

    // Cleanup on component unmount
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleSendFriendLink = () => {
    const friendLink = `${window.location.origin}/add-friend?ref=user-${Date.now()}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Add me as a friend!',
        text: 'Join my network on this app!',
        url: friendLink,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(friendLink);
      alert('Friend link copied to clipboard!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 bg-gray-300" style={{ top: 0, left: 0, width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <div className="popup-window bg-gray-300" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, border: 'none' }}>
        <div className="window-titlebar">
          <span>Add Friend</span>
          <button 
            onClick={async () => {
              console.log('X button clicked - stopping camera');
              stopCamera();
              // Give a small delay to ensure cleanup completes
              await new Promise(resolve => setTimeout(resolve, 100));
              onClose();
            }}
            className="w-6 h-6 bg-gray-300 border border-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
            style={{ border: '2px outset #e0e0e0' }}
          >
            <X className="w-3 h-3 text-black" />
          </button>
        </div>

        
        <div className="window-content h-full overflow-y-auto p-6">
          <div className="space-y-8 max-w-2xl mx-auto">
            
            {/* Send Friend Link Button */}
            <div className="text-center">
              <button 
                onClick={handleSendFriendLink}
                className="friend-widget px-8 py-4 pixel-font text-lg flex items-center gap-4 mx-auto hover:bg-gray-200 transition-colors"
              >
                <UserPlus className="w-6 h-6 text-black" />
                <span>Send Friend Link</span>
              </button>
            </div>

            {/* Camera for QR Scanning */}
            <div className="text-center">
              <h3 className="pixel-font text-xl mb-4 font-bold">Scan QR Code</h3>
              <div className="mx-auto w-80 h-60 bg-black border-4 border-gray-600 relative overflow-hidden"
                   style={{ border: '4px inset #e0e0e0' }}>
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-blue-500 opacity-50 pointer-events-none">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-blue-300 border-dashed"></div>
                  </div>
                </div>
              </div>
              <p className="pixel-font text-sm mt-2">Point camera at friend's QR code</p>
            </div>

            {/* User's QR Code */}
            <div className="text-center">
              <h3 className="pixel-font text-xl mb-4 font-bold">Your QR Code</h3>
              <div className="mx-auto w-fit bg-white p-4 border-4 border-gray-600"
                   style={{ border: '4px inset #e0e0e0' }}>
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Your QR Code" className="mx-auto" />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                    <span className="pixel-font text-gray-500">Generating...</span>
                  </div>
                )}
              </div>
              <p className="pixel-font text-sm mt-2">Let friends scan this code</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};